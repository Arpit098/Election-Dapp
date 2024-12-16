"use client"
import React, { useState } from 'react'
import { useBlockchain } from '../Context/BlockchainProvider' // Import the blockchain context

export function CandidateModal({ isOpen, onClose }) {
  const [candidateName, setCandidateName] = useState('')
  const { contractInstance, isConnected } = useBlockchain()
  const handleSendClick = async () => {
    try {
      if (!isConnected) {
        alert("Please connect your wallet first");
        return;
      }
      onClose();
      const totalCandidates = await contractInstance?.totalCandidates();
      console.log("Total candidates:", totalCandidates);
  
      // Ensure totalCandidates is treated as BigInt
      const candidateId = BigInt(totalCandidates) + 1n; // Add 1 as BigInt
  
      const transaction = await contractInstance.addCandidate(candidateId, candidateName);
      await transaction.wait(); // Wait for transaction confirmation
  
      alert("Successfully became a candidate!");
      console.log("Transaction result:", transaction);
      onClose();
    } catch (error) {
      // Extract and display error message
      const errorMessage = error?.reason || error?.data?.message || "An error occurred";
      if (errorMessage.includes("Candidate already exists")) {
        alert("Error: Candidate already exists.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
      console.error("Error calling addCandidate:", error);
    }
  
    setCandidateName("");
  };
  
  
  
  

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Become a Candidate</h2>
        <p className="mb-4 text-gray-300">Please enter your name to register as a candidate.</p>
        <div className="mb-4">
         
          <input
            type="text"
            id="name"
            placeholder='Enter your name here...'
            value={candidateName}
            onChange={(e) =>setCandidateName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSendClick}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

