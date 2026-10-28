const fs = require("fs");
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { prerender } = require("../package.json");

const sourceDirectory = path.resolve(__dirname, "..", prerender.source || "dist");
const shellPath = path.join(sourceDirectory, "index.html");
const shellHtml = fs.readFileSync(shellPath);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const localExecutableCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const startStaticServer = () => {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
    let pathname;

    try {
      pathname = decodeURIComponent(requestUrl.pathname);
    } catch {
      response.writeHead(400).end("Bad request");
      return;
    }

    const extension = path.extname(pathname).toLowerCase();
    if (!extension) {
      response.writeHead(200, { "Content-Type": contentTypes[".html"] });
      response.end(shellHtml);
      return;
    }

    const relativePath = pathname.replace(/^\/+/, "");
    const filePath = path.resolve(sourceDirectory, relativePath);
    const isInsideSource =
      filePath === sourceDirectory || filePath.startsWith(`${sourceDirectory}${path.sep}`);

    if (!isInsideSource || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
};

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

const resolveBrowser = async () => {
  const localExecutable = localExecutableCandidates.find((candidate) =>
    fs.existsSync(candidate)
  );

  if (localExecutable && !process.env.VERCEL) {
    return {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: localExecutable,
    };
  }

  return {
    args: chromium.args,
    executablePath: await chromium.executablePath(),
  };
};

const snapshotPathsForRoute = (route) => {
  if (route === "/") {
    return [shellPath];
  }

  const segments = route.split("/").filter(Boolean);
  return [
    path.join(sourceDirectory, ...segments, "index.html"),
    path.join(sourceDirectory, ...segments) + ".html",
  ];
};

const writeSnapshot = (route, html) => {
  for (const snapshotPath of snapshotPathsForRoute(route)) {
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
    fs.writeFileSync(snapshotPath, html);
  }
};

const configurePage = async (page, origin) => {
  await page.setUserAgent("ReactSnap");

  if (!prerender.skipThirdPartyRequests) return;

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      request.continue();
      return;
    }

    if (url.startsWith(origin)) request.continue();
    else request.abort();
  });
};

const renderRoute = async (page, origin, route) => {
  await page.goto(`${origin}${route}`, {
    timeout: 45_000,
    waitUntil: "networkidle0",
  });
  await page.waitForFunction(
    () => document.querySelector("#root")?.children.length > 0 && document.title,
    { timeout: 30_000 }
  );
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  await page.evaluate(() => window.snapSaveState?.());

  writeSnapshot(route, await page.content());
};

const run = async () => {
  if (!Array.isArray(prerender.include) || prerender.include.length === 0) {
    throw new Error("No routes are configured for prerendering.");
  }

  fs.copyFileSync(shellPath, path.join(sourceDirectory, "200.html"));

  const { server, origin } = await startStaticServer();
  let browser;

  try {
    const browserOptions = await resolveBrowser();
    browser = await puppeteer.launch({
      ...browserOptions,
      defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
      headless: "shell",
    });

    const routes = [...prerender.include];
    const workerCount = Math.min(prerender.concurrency || 4, routes.length);
    let nextRouteIndex = 0;

    await Promise.all(
      Array.from({ length: workerCount }, async () => {
        const page = await browser.newPage();
        await configurePage(page, origin);

        try {
          while (nextRouteIndex < routes.length) {
            const routeIndex = nextRouteIndex;
            nextRouteIndex += 1;
            const route = routes[routeIndex];
            await renderRoute(page, origin, route);
            console.log(`Prerendered ${routeIndex + 1}/${routes.length}: ${route}`);
          }
        } finally {
          await page.close();
        }
      })
    );
  } finally {
    if (browser) await browser.close();
    await closeServer(server);
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
