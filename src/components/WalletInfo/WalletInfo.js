import React from "react";
import classes from "./WalletInfo.module.css";

const WalletInfo = (props) => {
  return (
    <div>
    <div className={["wallet-info-1"]}>
      <h2 >Wallet Address:</h2>
      <h4>{props.walletAddress}</h4>
      <h5>ETH Balance:</h5>
      <h6>{props.ethBalance}</h6>
    </div>
    <hr />
    <div className={classes["wallet-info"]}>
      <div className={classes["balance"]}>
        <div className={classes["balance__label"]}>DAI</div>
        <div className={classes["balance__amount"]}>{props.tokenBalance}</div>
      </div>

      <div className={classes["balance"]}>
        <div className={classes["balance__label"]}>VAULT</div>
        <div className={classes["balance__amount"]}>{props.vaultBalance}</div>
      </div>
    </div>
    </div>
  );
};

export default WalletInfo;
