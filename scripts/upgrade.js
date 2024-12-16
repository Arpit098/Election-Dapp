const { ethers, upgrades } = require("hardhat");

async function main() {
    // Get the factory for the new version of the contract
    const votingFactoryV2 = await ethers.getContractFactory("VotingDapp");

    // Provide the proxy address of the deployed contract
    const proxyAddress = "0xe1F6aEEF873a94C639ddB6e7cd48aA1b4ABC12cB";

    // Upgrade the proxy to the new implementation
    const upgradedVoting = await upgrades.upgradeProxy(proxyAddress, votingFactoryV2);

    // Wait for the deployment to complete
    await upgradedVoting.waitForDeployment();

    console.log("Voting contract upgraded to new implementation at:", await upgradedVoting.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//deployed to:0xe1F6aEEF873a94C639ddB6e7cd48aA1b4ABC12cB