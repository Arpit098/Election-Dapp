"use client";
import React, { useState, useEffect } from "react";
import Nav  from "../Components/Navbar";
import { Button } from "@nextui-org/react";
import { useBlockchain } from "../Context/BlockchainProvider";
import { RxReload } from "react-icons/rx";

function Result() {
  const { contractInstance, isConnected } = useBlockchain();
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch results from the contract
  useEffect(() => {
    fetchResults();
  }, [contractInstance]);
  const fetchResults = async () => {
    if (!contractInstance) {
      setIsLoading(false);
      alert("Please connect your wallet to view the results");
      return;
    }
    setIsLoading(true)
    const electionNumberBig = await contractInstance?.electionNumber();
    const electionNumber = Number(electionNumberBig);
    console.log(electionNumber);
    const fetchedResults = [];
    try {
      // Fetch candidates for all elections
      for (let i = electionNumber-1; i > 0; i--) {
          try {
            const candidate = await contractInstance.results(i);
            console.log("loop",candidate);
            fetchedResults.push({
              electionId: i,
              candidateId: candidate.candidateId,
              name: candidate.name,
              voteCount: Number(candidate.voteCount),
            });
          } catch (err) {
            console.error("Error fetching results:", err);
            break; // Stop fetching when no more candidates exist
          }
      }
      setElections(fetchedResults);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Failed to fetch election results");
      setIsLoading(false);
    }
  };
  const concludeElection = async () => {
    if (!contractInstance) {
      alert("Please connect your wallet to conclude the election");
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contractInstance.result();
      await tx.wait();
      alert("Election concluded successfully");
    } catch (err) {
      console.error("Error concluding election:", err);
      alert("Failed to conclude the election");
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-900 text-white">
    <Nav />
    {/* Heading and Buttons */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8 mt-8 sm:mt-16">
      <div className="flex justify-center items-center mb-6 space-x-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Election Results</h1>
        <Button onPress={concludeElection} color="secondary" size="md">
          Conclude Election
        </Button>
        <RxReload
          className="text-2xl sm:text-3xl text-gray-400 hover:text-gray-200 transition-transform transform hover:scale-110 ml-2"
          onClick={fetchResults}
        />
      </div>
      {/* Conditional Content */}
      {isLoading ? (
        <div className="flex items-center justify-center mt-8">
          <p>Loading results...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center mt-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        elections.map((election, index) => (
          <div
            key={election.electionId}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto mb-8"
          >
            <h2 className="text-xl font-semibold text-center bg-gray-700 py-4">
              Election #{election.electionId}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 sm:px-6 py-3 text-purple-300 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      Candidate ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-purple-300 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-purple-300 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      Vote Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    key={election.candidateId}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                    } hover:bg-gray-700 transition-colors duration-200`}
                  >
                    <td className="px-4 sm:px-6 py-4 text-left text-sm">
                      {election.candidateId}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm">
                      {election.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm inline-block min-w-[2.5rem]">
                        {election.voteCount || 0}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  );
  
}

export default Result;
