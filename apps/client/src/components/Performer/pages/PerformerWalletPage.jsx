import React from "react";
import PerformerWalletLayout from "../components/PerformerWalletLayout";
import PerformerWalletEarningsView from "../components/wallet/PerformerWalletEarningsView";

const PerformerWalletPage = () => (
  <PerformerWalletLayout>
    <PerformerWalletEarningsView title="Wallet" />
  </PerformerWalletLayout>
);

export default PerformerWalletPage;
