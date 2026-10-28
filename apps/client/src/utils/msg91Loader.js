import { OTPWidget } from "@msg91comm/sendotp-sdk";

/**
 * MSG91 phone OTP — mirrors Flutter AuthService (sendotp_flutter_sdk):
 *   OTPWidget.initializeWidget(widgetId, token)
 *   OTPWidget.sendOTP({ identifier: '91XXXXXXXXXX' }) → requestId
 *   OTPWidget.verifyOTP({ reqId, otp }) → accessToken
 *   OTPWidget.retryOTP({ reqId, retryChannel: 11 })
 *
 * Response shapes (same as Flutter):
 *   New:  { type: 'success', data: { requestId | accessToken } }
 *   Old:  { type: 'success', message: '<requestId|accessToken>' }
 */

let sdkReady = false;
let lastReqId = null;

function getWidgetId() {
  return String(import.meta.env.VITE_MSG91_WIDGET_ID || "").trim();
}

function getWidgetToken() {
  return String(
    import.meta.env.VITE_MSG91_WIDGET_TOKEN ||
      import.meta.env.VITE_MSG91_AUTH_KEY ||
      ""
  ).trim();
}

export function isMsg91Configured() {
  const widgetId = getWidgetId();
  const token = getWidgetToken();
  return Boolean(widgetId && token && token !== "{token}");
}

export function getLastMsg91ReqId() {
  return lastReqId;
}

function normalizeMsg91Error(err) {
  if (!err) return "Failed to send SMS OTP.";
  if (typeof err === "string") return err;
  if (typeof err?.message === "string" && err.message !== "[object Object]") {
    return err.message;
  }
  if (typeof err?.error === "string") return err.error;
  if (typeof err?.errors === "string") return err.errors;
  if (Array.isArray(err?.errors)) return err.errors.join(", ");
  if (err?.hasError && err?.errors) return String(err.errors);
  try {
    return JSON.stringify(err);
  } catch {
    return "Failed to send SMS OTP.";
  }
}

function classifySendFailure(message) {
  const lower = String(message || "").toLowerCase();
  if (lower.includes("subscription not found")) {
    return "MSG91_SUBSCRIPTION_NOT_FOUND";
  }
  if (
    lower.includes("mobile requests are not allowed") ||
    lower.includes("web requests are not allowed")
  ) {
    return "MSG91_MOBILE_BLOCKED";
  }
  if (
    lower.includes("captcha") ||
    lower.includes("hcaptcha") ||
    lower.includes("recaptcha")
  ) {
    return "MSG91_CAPTCHA_REQUIRED";
  }
  return "MSG91_SEND_FAILED";
}

/** Same requestId extraction as Flutter AuthService.sendPhoneOtp */
export function extractMsg91RequestId(response = {}) {
  if (response?.type === "success" || response?.type == null) {
    const fromData =
      response?.data?.requestId ||
      response?.data?.reqId ||
      response?.data?.request_id;
    if (fromData) return String(fromData);

    // Legacy: message field is the requestId (not a JWT)
    const message = response?.message;
    if (typeof message === "string" && message && message.length < 80) {
      return message;
    }
  }

  return (
    response?.reqId ||
    response?.requestId ||
    response?.request_id ||
    response?.data?.reqId ||
    response?.data?.requestId ||
    null
  );
}

/** Same access-token extraction as Flutter AuthService.verifyPhoneOtp */
export function extractMsg91AccessToken(data) {
  if (!data) return null;

  const fromData =
    data?.data?.accessToken ||
    data?.data?.token ||
    data?.data?.jwt;
  if (fromData) return String(fromData);

  // Legacy: message field contains the JWT
  if (
    typeof data?.message === "string" &&
    data.message.length > 50 &&
    data.message !== "otp verified successfully"
  ) {
    return data.message;
  }

  return (
    data?.token ||
    data?.jwt ||
    data?.accessToken ||
    null
  );
}

function assertNotFailed(response) {
  const failed =
    response?.hasError === true ||
    response?.status === "fail" ||
    response?.type === "error" ||
    response?.type === "fail" ||
    (typeof response?.errors === "string" && response.errors.length > 0) ||
    (Array.isArray(response?.errors) && response.errors.length > 0);

  if (failed) {
    const message = normalizeMsg91Error(response);
    const err = new Error(message);
    err.code = classifySendFailure(message);
    err.raw = response;
    throw err;
  }
}

async function ensureSdkInitialized() {
  if (!isMsg91Configured()) return false;
  if (sdkReady) return true;

  await OTPWidget.initializeWidget(getWidgetId(), getWidgetToken());
  sdkReady = true;
  console.info("[MSG91] SDK initialized (Flutter-parity)", {
    widgetId: getWidgetId(),
  });
  return true;
}

/** Flutter does not load the web script — SDK init is enough. */
export async function loadMsg91Widget() {
  return ensureSdkInitialized();
}

/**
 * Flutter: OTPWidget.sendOTP({ identifier }) → requestId string
 * Returns { reqId, type, raw } for AuthPage compatibility.
 */
export async function sendMsg91Otp(identifier) {
  const ready = await ensureSdkInitialized();
  if (!ready) {
    const err = new Error(
      "Phone OTP is not configured. Check VITE_MSG91_WIDGET_ID and VITE_MSG91_WIDGET_TOKEN."
    );
    err.code = "MSG91_NOT_READY";
    throw err;
  }

  const phone = String(identifier || "").replace(/\D/g, "");
  console.info("[MSG91] sendOTP identifier=", phone);

  let response;
  try {
    response = await OTPWidget.sendOTP({ identifier: phone });
  } catch (e) {
    const message = normalizeMsg91Error(e);
    const err = new Error(message);
    err.code = classifySendFailure(message);
    err.raw = e;
    throw err;
  }

  console.info("[MSG91] sendOTP response:", response);
  assertNotFailed(response);

  // Flutter requires type === 'success' when present
  if (response?.type && response.type !== "success") {
    const message = normalizeMsg91Error(response) || "Failed to send SMS OTP.";
    const err = new Error(message);
    err.code = classifySendFailure(message);
    err.raw = response;
    throw err;
  }

  const reqId = extractMsg91RequestId(response);
  if (!reqId) {
    const err = new Error(
      "MSG91 returned success but no requestId (check widget credentials match Flutter)."
    );
    err.code = "MSG91_SEND_FAILED";
    err.raw = response;
    throw err;
  }

  lastReqId = reqId;
  console.info("[MSG91] OTP queued. requestId=", reqId);
  return { reqId, type: "success", raw: response };
}

/** Flutter: OTPWidget.retryOTP({ reqId, retryChannel }) — SMS=11 */
export async function retryMsg91Otp(channel = 11, reqId = lastReqId) {
  await ensureSdkInitialized();
  if (!reqId) {
    const err = new Error("OTP session expired. Request a new code.");
    err.code = "MSG91_NO_REQ_ID";
    throw err;
  }
  const response = await OTPWidget.retryOTP({
    reqId,
    retryChannel: channel,
  });
  assertNotFailed(response);
  if (response?.type && response.type !== "success") {
    const err = new Error(normalizeMsg91Error(response));
    err.code = "MSG91_SEND_FAILED";
    err.raw = response;
    throw err;
  }
  return response;
}

/**
 * Flutter: OTPWidget.verifyOTP({ reqId, otp })
 * Prefer explicit reqId (AuthPage should pass last send's requestId).
 */
export async function verifyMsg91Otp(otp, reqId = lastReqId) {
  await ensureSdkInitialized();

  if (!reqId) {
    const err = new Error("OTP session expired. Request a new code.");
    err.code = "MSG91_NO_REQ_ID";
    throw err;
  }

  const response = await OTPWidget.verifyOTP({
    reqId,
    otp: String(otp),
  });
  console.info("[MSG91] verifyOTP response:", response);
  assertNotFailed(response);

  if (response?.type && response.type !== "success") {
    const err = new Error(normalizeMsg91Error(response) || "Invalid OTP.");
    err.code = "MSG91_VERIFY_FAILED";
    err.raw = response;
    throw err;
  }

  const token = extractMsg91AccessToken(response);
  if (!token) {
    const err = new Error("OTP verified but no access token returned.");
    err.code = "MSG91_VERIFY_FAILED";
    err.raw = response;
    throw err;
  }

  return { ...response, accessToken: token, token };
}

export function unloadMsg91Widget() {
  sdkReady = false;
  lastReqId = null;
}
