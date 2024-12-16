"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import ContractAbi from "./Abi.json";

// Create the context
const BlockchainContext = createContext();

// Custom hook to use the blockchain context
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

// Blockchain Provider Component
export const BlockchainProvider = ({ children }) => {
  // State variables
  const [contractInstance, setContractInstance] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const abi = ContractAbi.abi;
  const contractAddress = "0xe1F6aEEF873a94C639ddB6e7cd48aA1b4ABC12cB";

  // Setup account change listener
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length > 0) {
        setCurrentUser(accounts[0]);
        // Optional: you might want to re-establish the contract instance
      } else {
        disconnectWallet();
      }
    };

    // Add listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Cleanup listener on unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Connect Wallet Function
  const connectWallet = async () => {
    if (typeof window !== "undefined") {
      try {
        // Detect Ethereum provider
        const ETHProvider = await detectEthereumProvider();
        
        if (ETHProvider) {
          // Create browser provider
          const provider = new ethers.BrowserProvider(ETHProvider);
          await sendRequest(provider);
        } else {
          alert("Please install MetaMask wallet to use this site");
        }
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    }
  };

  // Reconnect Wallet (used when accounts change)
  // Send Request and Get Instance
  const sendRequest = async (provider) => {
    try {
      if (provider) {
        // Request accounts
        const accounts = await provider.send('eth_requestAccounts', []);
        // Set current user
        const currentAccount = accounts[0];
        setCurrentUser(currentAccount);        
        // Get contract instance
        await getInstance(provider);
        
        // Set connection state
        setIsConnected(true);
      }
    } catch (err) {
      console.error("Send request error:", err.message);
      setIsConnected(false);
    }
  };

  // Get Contract Instance
  const getInstance = async (provider) => {
    try {
      // Get signer
      const signer = await provider.getSigner();
      
      // Create contract instance
      const contractInst = new ethers.Contract(contractAddress, abi, signer);
      setContractInstance(contractInst);
    } catch (err) {
      console.error("Get instance error:", err.message);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    // Reset all states
    setContractInstance(null);
    setCurrentUser(null);
    setIsConnected(false);
  };

  // Context value
  const contextValue = {
    connectWallet,
    disconnectWallet,
    currentUser,
    contractInstance,
    isConnected
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};