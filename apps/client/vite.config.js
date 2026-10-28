import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

const DEFAULT_LAMBDA =
  "https://wcnwjjyw3er242onl66k4ljnei0xqykl.lambda-url.ap-south-1.on.aws";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const lambdaTarget = String(
    env.ONIT_BACKEND_API_URL || env.VITE_API_PROXY_TARGET || DEFAULT_LAMBDA
  ).replace(/\/$/, "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Emit gzip + brotli alongside every JS/CSS chunk so the CDN/server
      // can serve pre-compressed files without runtime CPU cost.
      compression({ algorithm: "gzip", exclude: [/\.(png|jpe?g|webp|gif|svg|ico)$/] }),
      compression({ algorithm: "brotliCompress", exclude: [/\.(png|jpe?g|webp|gif|svg|ico)$/] }),
    ],
    build: {
      // Warn when a chunk exceeds 500 KiB (Vite default is 500 KiB).
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — tiny, loads first, long-cached.
            "vendor-react": ["react", "react-dom"],
            // Router — stable, separate from app code.
            "vendor-router": ["react-router-dom"],
            // Framer Motion is large (~140 KiB); isolate it so pages that
            // don't animate don't pay the cost.
            "vendor-framer": ["framer-motion"],
            // Auth0 SDK — only needed on auth flows.
            "vendor-auth0": ["@auth0/auth0-react"],
          },
        },
      },
    },
    server: {
      host: true,
      proxy: {
        "/api-onitindia": {
          target: lambdaTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-onitindia/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.removeHeader("origin");
            });
          },
        },
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/auth0": {
          target: "https://dev-jdesmpayywayutew.us.auth0.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/auth0/, ""),
        },
      },
    },
  };
});
