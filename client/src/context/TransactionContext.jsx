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

  return transactionContract;
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });

  const handleChange = (e, name) => {
    // setFormData passes previous State as the first parameter
    setFormData((prevState) => ({
      // copy the old state
      ...prevState,
      // change the value for your new key
      [name]: e.target.value
    }));
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);
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
        setCurrentAccount(accounts[0]);

        // get all transactions
      } else {
        console.log("No accounts found")
      }
    } catch (error) {
      console.log(error)

      throw new Error("No Ethereum Object")
    }
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      // get the data from the Form (Inputs in Welcome)
      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();

    } catch (error) {
      console.log(error)

      throw new Error("No Ethereum Object")
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, handleChange, formData, sendTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}
