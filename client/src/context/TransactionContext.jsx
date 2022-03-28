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
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    // setFormData passes previous State as the first parameter
    setFormData((prevState) => ({
      // copy the old state
      ...prevState,
      // change the value for your new key
      [name]: e.target.value
    }));
  }

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions();

      console.log(availableTransactions)

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }))

      console.log(structuredTransactions);
      setTransactions(structuredTransactions);

    } catch (error) {
      console.log(error)
    }
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
        getAllTransactions();
      } else {
        console.log("No accounts found")
      }
    } catch (error) {
      console.log(error)

      throw new Error("No Ethereum Object")
    }
  }

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount)

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
      // We need to parse the amount to hex
      // Using parseEther We parse the amount of Ether to hex in GWEI
      const parsedAmount = ethers.utils.parseEther(amount);

      const transactionContract = getEthereumContract();


      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', //21000 GWEI
          value: parsedAmount._hex
        }]
      });

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      console.log(`Transaction ${transactionHash.hash} is running`);

      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Transaction ${transactionHash.hash} completed`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());


    } catch (error) {
      console.log(error)

      throw new Error("No Ethereum Object")
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [])


  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, handleChange, formData, sendTransaction, transactions, isLoading }}>
      {children}
    </TransactionContext.Provider>
  )
}
