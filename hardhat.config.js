require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: { 
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY], 
    }
  },
  etherscan: {
    apiKey: {
      sepolia: 'EK4UAXPPGPSE2FVYUIYQT3IYCWX1K1DESE'
    }
  }
};
