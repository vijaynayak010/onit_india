import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PerformerPageHeader from "../PerformerPageHeader";
import TransactionListItem from "./TransactionListItem";
import { normalizeStatus } from "./walletUtils";
import { getTransactions } from "../../services/api";

const TABS = [
  { id: "all", label: "All" },
  { id: "successful", label: "Successful" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

const DEFAULT_PATHS = {
  back: "/performer/account",
  transactionDetail: (id) => `/performer/transactions/${id}`,
};

const PerformerWalletTransactionsView = ({ paths = DEFAULT_PATHS }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getTransactions({ limit: 100 });
        setTransactions(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((tx) => {
    const status = normalizeStatus(tx.status);
    if (activeTab === "all") return true;
    if (activeTab === "successful") return status === "completed";
    if (activeTab === "pending") return status === "pending";
    if (activeTab === "failed") return status === "failed";
    return true;
  });

  return (
    <div>
      <PerformerPageHeader
        title="Transaction History"
        subtitle="Earnings, withdrawals, and payout status"
        backTo={paths.back || "/performer/account"}
      />

      <div className="mb-6 flex border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 pb-3 text-[13px] font-bold transition ${
              activeTab === tab.id ? "text-[#10605F]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#10605F]" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 text-[#10605F]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-3 text-sm font-semibold text-gray-400">Loading transactions…</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((tx) => (
            <TransactionListItem
              key={tx.id}
              tx={tx}
              onClick={() => navigate(paths.transactionDetail(tx.id))}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-14 text-center">
          <p className="text-[14px] font-semibold text-gray-400">
            No {activeTab === "all" ? "" : activeTab} transactions found.
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformerWalletTransactionsView;
