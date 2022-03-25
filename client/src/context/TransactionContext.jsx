import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

// we have access to ethereum, because Metamask is installed in our browser
const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log({ provider, signer, transactionContract });
}

export const TransactionProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState('');

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.log(error)

      throw new Error("No Ethereum Object")
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {

      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts)

      if (accounts.length) {
        setConnectedAccount(accounts[0]);

        // get all transactions
      } else {
        console.log("No accounts found")
      }
    } catch (error) {
      console.log(error)

      throw new Error("No Ethereum Object")
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <TransactionContext.Provider value={{ connectWallet }}>
      {children}
    </TransactionContext.Provider>
  )
}
