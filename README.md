# ELECTION DAPP

Welcome to our decentralized election platform! Here, you can participate in elections as a candidate or a voter after registering as a user. You'll have access to a dashboard to view ongoing elections, candidates, and their vote counts. A dedicated results page allows you to see the final election outcomes seamlessly.

# Hardhat Section

Smart Contract:
  -> Used Solidity to create upgradeable smart contract for the voting process.
  -> Deployed the smart contracts to the Sepolia testnet (Mentioned testnet Rinkeby or Ropsten are depricated thats why i used sepolia another etherium testnet).
The smart contract handles:
  1) Registering as candidate or Registering as user. Resgistering as candidate allows you to participate in election and Registering as user will let you vote for the candidate
  2) Fetching the list of candidates.
  3) Fetching the vote count for each candidate.
  4) Ensuring only registered voters can vote.
  5) Anyone can conclude the voting results. I could have added the onlyOwner modifier to restrict this action to a specific person, but that would cause issues for others testing the contract.
  6) When results are calculated and the winner is selected on the basis of most vote count the vote counts for all the candidates are reset to 0 for new election.
  7) Fetching the results.
Testing:
Created unit tests for the smart contracts using a testing framework Hard Hat.

You can run compile or test the smartcontract by running:
```shell
npm install --save-dev hardhat
npx hardhat compile or npx hardhat test
```
# Frontend Section

-> Used Next.js(React.js), tailwind css, NextUi for creating the frontend.

Components:
  1) Navbar: it contains a connect wallet button and links which lets you to visit the dashboard page and results page.
  2) Hero.jsx: it is the home page contains basic description and two buttons which let you register as candidate or user. 
  3) UserModal.jsx: it contains code to register as user.
  4) CandidateModal.jsx: it contains code register as candidate.
    
-> Dashboard/page.jsx: this page shows the list of candidates with their current vote count and a button to vote them. *Note: voting can only be dont by registered users*
-> Result/page.jsx: this page contains the code to conclude the ongoing election.

Context:
 BrowserProvider.jsx: This file uses the createContext and useContext hooks to provide functions for connecting the wallet and resources for interacting with smart contract functions, which are then shared with other 
 components.

->You can run the project by running
 ```shell
cd app
npm i
npm run dev
```
*Note: You may experience some delays in loading pages or retrieving results due to the current beta version of Next.js. By default, the latest version of Next.js is used when creating a new Next.js app, and at this time, the latest version happens to be a beta release.*

















