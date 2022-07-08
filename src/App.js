import React, { useState, useEffect } from "react";

import Web3 from "web3";
import SwapToken from "./artifacts/contracts/swapToken.sol/SwapToken.json"

import WalletInfo from "./components/WalletInfo/WalletInfo";
import SwapEth from "./components/SwapEth/SwapEth";
import MainHeader from "./components/MainHeader/MainHeader";

import config from './config'


function App() {
  const [web3, setWeb3] = useState("");
  const [ethBalance, setEthBalance] = useState(1);
  const [DAIBalance, setDAIBalance] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [investor, setInvestor] = useState(1000000000);
  const [swapTokenContract, setSwapTokenContract] = useState({});
  const [ethAmount, setEthAmount] = useState(0);
  
  useEffect(() => {
    const init = async () => {
      await loadWeb3();
    };
    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      await loadBlockchainData();
    };
    load();
  }, [web3]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        const _web3 = new Web3(window.ethereum);
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWeb3(_web3);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please Install MetaMask");
    }
  };

  const loadBlockchainData = async () => {
    if (web3) {
      const [investor] = await web3.eth.getAccounts();
      setInvestor(investor);
      const balance = await web3.eth.getBalance(investor);
      setEthBalance(web3.utils.fromWei(balance, "ether"));
      const swapTokenInstance = new web3.eth.Contract(SwapToken.abi, config.swapTokenAddress);
      setSwapTokenContract(swapTokenInstance);
      let tokenBalances = await swapTokenInstance.methods
        .getUserVaultAndDAIBalance(investor)
        .call();
      console.log('here', tokenBalances)
      setDAIBalance(tokenBalances[1] / Math.pow(10, config.decimal));
      setVaultBalance(tokenBalances[0]/ Math.pow(10, config.decimal));
    }
  };

  const swapEthHandler = async () => {
    if (swapTokenContract) {
      await swapTokenContract.methods
        .depositTokensForEth()
        .send({
          value: web3.utils.toWei(ethAmount, "ether"),
          from: investor,
        });

      const balance = await web3.eth.getBalance(investor);
      const tokenBalances = await swapTokenContract.methods
        .getUserVaultAndDAIBalance(investor)
        .call();
      setDAIBalance(tokenBalances[1] / Math.pow(10, config.decimal));
      setVaultBalance(tokenBalances[0] / Math.pow(10, config.decimal))
      setEthBalance(web3.utils.fromWei(balance, "ether"));
    }
  };

  const withdrawTokensHandler = async () => {
    if (swapTokenContract) {
      await swapTokenContract.methods
        .withdrawTokens()
        .send({
          from: investor,
        });

      const balance = await web3.eth.getBalance(investor);
      const tokenBalances = await swapTokenContract.methods
        .getUserVaultAndDAIBalance(investor)
        .call();
      setDAIBalance(tokenBalances[1] / Math.pow(10, config.decimal));
      setVaultBalance(tokenBalances[0] / Math.pow(10, config.decimal))
      setEthBalance(web3.utils.fromWei(balance, "ether"));
    }
  }

  const onEthEnteredHandler = (ethAmount) => {
    setEthAmount(ethAmount);
  };
  
  return (
    <React.Fragment>
      <MainHeader />
      <main>
        <WalletInfo ethBalance={ethBalance} tokenBalance={DAIBalance}  vaultBalance={vaultBalance} walletAddress={investor}/>
        <SwapEth onEthEntered={onEthEnteredHandler} onSwap={swapEthHandler} onWithdraw={withdrawTokensHandler}/>
      </main>
    </React.Fragment>
  );
}

export default App;
