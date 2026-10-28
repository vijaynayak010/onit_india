const RAZORPAY_SCRIPT_ID = "razorpay-checkout-js";
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayPromise;

export function loadRazorpay() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser."));
  }

  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(RAZORPAY_SCRIPT_ID);
    const script = existing || document.createElement("script");

    const handleLoad = () => {
      if (window.Razorpay) resolve(window.Razorpay);
      else reject(new Error("Razorpay loaded without exposing the checkout API."));
    };

    const handleError = () => {
      razorpayPromise = undefined;
      reject(new Error("Unable to load the secure payment checkout. Please try again."));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.id = RAZORPAY_SCRIPT_ID;
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return razorpayPromise;
}
