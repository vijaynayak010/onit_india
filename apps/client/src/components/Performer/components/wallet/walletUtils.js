export const PRIMARY_GREEN = "#10605F";

export const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(val) || 0);

export const formatTxDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const normalizeStatus = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED" || s === "SUCCESSFUL") return "completed";
  if (s === "PENDING" || s === "PROCESSING") return "pending";
  if (s === "FAILED") return "failed";
  return "completed";
};

export const statusLabel = (status) => {
  const n = normalizeStatus(status);
  if (n === "completed") return "Completed";
  if (n === "pending") return "Processing";
  return "Failed";
};

export const getPayoutMethodInfo = (method) => {
  if (!method) {
    return {
      name: "No payout account",
      detail: "Add a bank account to withdraw",
      last4: "----",
      verified: false,
    };
  }
if (method.type === "BANK" || method.type === "BANK_ACCOUNT") {
    const last4 =
      method.details?.accountLast4 ||
      method.details?.accountNumber?.slice(-4) ||
      "----";
    return {
      name: method.details?.bankName || "Bank Account",
      detail: `•••• ${last4}`,
      last4,
      verified: method.isVerified !== false,
    };
  }
  if (method.type === "UPI") {
    return {
      name: "UPI",
      detail: method.details?.upiId || method.handle || method.upiId || "UPI ID",
      last4: null,
      verified: method.isVerified !== false,
    };
  }
  return {
    name: method.type || "Payout method",
    detail: "Linked account",
    last4: null,
    verified: method.isVerified !== false,
  };
};

export const getTxTitle = (tx) => {
  if (tx.relatedTask?.title) return tx.relatedTask.title;
  if (tx.description) return tx.description;
  return tx.type === "CREDIT" ? "Earnings" : "Withdrawal";
};

export const getWithdrawDestinationLabel = (method) => {
  const info = getPayoutMethodInfo(method);
  if (info.last4) return `${info.name} •••• ${info.last4}`;
  return info.name;
};

/** Normalize direct arrays and documented envelope shapes from wallet transaction endpoints. */
export const extractTransactionList = (response) => {
  const raw = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.transactions)
        ? response.transactions
        : Array.isArray(response?.data?.transactions)
          ? response.data.transactions
          : [];
  const seen = new Set();
  return raw.filter((tx) => {
    if (!tx || typeof tx !== "object") return false;
    if (!tx.id) return true;
    const key = String(tx.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
