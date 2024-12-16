const { ethers, upgrades } = require("hardhat");

async function main() {
    const votingFactory = await ethers.getContractFactory("VotingDapp");

    const Voting = await upgrades.deployProxy(
        votingFactory,
        [],
        { initializer: "initialize" }
    );

    await Voting.waitForDeployment();

    console.log("Voting deployed to:", await Voting.getAddress());

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//deployed to: 0xe1F6aEEF873a94C639ddB6e7cd48aA1b4ABC12cB