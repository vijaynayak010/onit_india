import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Redirect legacy route to settings wallet withdraw. */
const PerformerWithdrawPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/performer/wallet/withdraw", { replace: true });
  }, [navigate]);
  return null;
};

export default PerformerWithdrawPage;
