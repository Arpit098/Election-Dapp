// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract VotingDapp is ReentrancyGuardUpgradeable {
    //to track number of candidates
    uint public totalCandidates;
    //to track number of voters
    uint public totalUsers;
    //to track number of election
    uint public electionNumber;

    struct candidate {
        uint candidateId;
        string name;
        address candidateAddress;
        uint voteCount;
    }

    // Used for storing candidates
    mapping(uint => candidate) public candidates;
    
    // Used for registering users for authentication
    mapping(address => bool) public isRegistered;

    // Used for restricting the same address to become a candidate twice
    mapping(address => bool) public isCandidate;

    // Used for restricting voters to vote more than once in a single election
    mapping(uint => address[]) public hasVoted;

    // Used for storing election results
    mapping(uint => candidate) public results;

    function initialize() public initializer {
        __ReentrancyGuard_init();
        totalCandidates = 0;
        totalUsers = 0;
        electionNumber = 1;
    }
    
    function addCandidate(uint candidateId, string memory name) public {
        require(candidateId - 1 == totalCandidates, "Invalid candidate id");
        totalCandidates += 1;
        candidates[candidateId] = candidate(candidateId, name, msg.sender, 0);
    }

    function registerUser() external {
        require(!isRegistered[msg.sender], "User already exists");
        totalUsers += 1;
        isRegistered[msg.sender] = true;
    }

    function vote(uint candidateId) external nonReentrant {
        require(isRegistered[msg.sender], "User not registered");
        
        address[] memory votersList = hasVoted[electionNumber];
        
        //to check if the user has already voted
        for (uint i = 0; i < votersList.length; ++i) {
           require(votersList[i] != msg.sender, "You have already voted in this election");
        }
        //to mark user as voted for this election
        hasVoted[electionNumber].push(msg.sender);

        //to update the vote count
        candidates[candidateId].voteCount += 1;
    }

    function result() external nonReentrant{

        require(totalCandidates > 0, "No candidates available");

        candidate memory leadingCandidate = candidates[1]; // Assume the first candidate is leading initially
       
        //To find the candidate with the highest vote count
        for (uint i = 2; i <= totalCandidates; i++) {
            if (candidates[i].voteCount > leadingCandidate.voteCount) {
                leadingCandidate = candidates[i];
            }
        }
        //storing the result for later use
        results[electionNumber] = leadingCandidate;

        //automatically start new election
        electionNumber += 1;
        // reset votes
        for (uint i = 1; i <= totalCandidates; i++) {
            candidates[i].voteCount = 0;
        }
        
    }
}
