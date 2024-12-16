'use client'
import React, { useState, useEffect } from "react";
import Nav from "../Components/Navbar";
import { Button } from "@nextui-org/react";
import { useBlockchain } from "../Context/BlockchainProvider";
import { RxReload } from "react-icons/rx";

function VotingDashboard() {
  const { contractInstance, isConnected } = useBlockchain();
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidates from the contract
  useEffect(() => {
    fetchCandidates();
  }, [contractInstance, isConnected]);

  const fetchCandidates = async () => {
    if (!contractInstance) {
      setIsLoading(false);
      alert("Please connect your wallet to view the candidates");
      return;
    }

    try {
      // Get total number of candidates
      const totalCandidates = await contractInstance.totalCandidates();
      
      // Fetch candidates
      const fetchedCandidates = [];

      for (let i = 1; i <= totalCandidates; i++) {
        const candidate = await contractInstance.candidates(i);
        fetchedCandidates.push({
          candidateId: candidate.candidateId,
          name: candidate.name,
          candidateAddress: candidate.candidateAddress,
          voteCount: Number(candidate.voteCount)
        });
      }
      console.log("Candidates fetched:", fetchedCandidates);
      setCandidates(fetchedCandidates);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to fetch candidates");
      setIsLoading(false);
    }
  };

  // Handle voting
  const handleVote = async (candidateId) => {
    if (!contractInstance || !isConnected) {
      alert("Please connect your wallet first");
      return;
    }
  
    try {
      // Call the vote method
      const result = await contractInstance.vote(candidateId);
  
      // Assuming result contains a transaction hash or confirmation details
      if (result) {
        alert(`Vote cast successfully wait for transaction to complete and reload the page!`);
      }
    } catch (err) {
      console.error("Voting failed:", err);
  
      // Handle specific errors based on message or code
      if (err.code === 4001) {
        // User rejected the transaction
        alert("Transaction rejected by user.");
      }
      else if(err.message.includes("User not registered")) {
        alert("User not registered. Please register first.");
      }
      else if(err.message.includes("You have already voted in this election")) {
        alert("You have already voted in this election.");
      }
      else {
        // Generic error
        alert("An error occurred during voting. Please try again later.");
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <>
      <Nav/>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading candidates...</p>
      </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Nav/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8 mt-8 sm:mt-16">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mr-4">Participants</h1>
          <RxReload
            className="text-2xl sm:text-3xl text-gray-400 hover:text-gray-200 transition-transform transform hover:scale-110 cursor-pointer"
            onClick={fetchCandidates}
          />
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 sm:px-6 py-3 text-purple-300 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-purple-300 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Vote Count
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-purple-300 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              {isLoading ? (
                <div className="flex items-center justify-center mt-8">
                  <p>Loading results...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center mt-8">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <tbody>
                {candidates.map((candidate, index) => (
                  <tr
                    key={candidate.candidateId}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors duration-200`}
                  >
                    <td className="px-4 sm:px-6 py-4 text-left text-sm">{candidate.name}</td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm inline-block min-w-[2.5rem]">
                        {candidate.voteCount || 0}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm">
                      <Button
                        onPress={() => handleVote(candidate.candidateId)}
                        color="secondary"
                        variant="shadow"
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        Vote
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingDashboard;