import React from "react";
import PerformerPageLayout from "./PerformerPageLayout";

const PerformerWalletLayout = ({ children, headerActive = "account", maxWidth = "6xl", ...props }) => (
  <PerformerPageLayout
    activePage={headerActive}
    maxWidth={maxWidth}
    showHeader={false}
    containerClassName=""
    {...props}
  >
    {children}
  </PerformerPageLayout>
);

export default PerformerWalletLayout;
