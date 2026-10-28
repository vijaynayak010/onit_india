import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Redirect legacy route to settings wallet transactions. */
const PerformerTransactionsPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/performer/wallet/transactions", { replace: true });
  }, [navigate]);
  return null;
};

export default PerformerTransactionsPage;
