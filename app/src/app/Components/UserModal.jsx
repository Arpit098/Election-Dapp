"use client"
import React, { useState } from 'react'
import { useBlockchain } from '../Context/BlockchainProvider' 
export function UserModal({ isOpen, onClose }) {
  const { contractInstance, isConnected } = useBlockchain()

  const handleVerifyClick = async () => {
    try {
      if (!isConnected) {
        alert("Please connect your wallet first");
        return;
      }
      
      const transaction = await contractInstance?.registerUser(); // Call the smart contract function
      onClose();
      await transaction.wait(); // Wait for the transaction to be mined
     
      alert("User successfully registered!");
      console.log("Transaction result:", transaction);
    } catch (error) {
      // Extract and display error message
      const errorMessage = error?.reason || error?.data?.message || "An error occurred";
      if (errorMessage.includes("User already exists")) {
        alert("Error: User already exists.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
      console.error("Error calling registerUser:", error);
    }
  };
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Become a Registered User</h2>
        <p className="mb-4 text-gray-300">Please click on the verify button to get yourself registered.</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleVerifyClick}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  )
}

