const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("VotingDapp", function () {
    let VotingDapp, votingDapp, candidate, candidate2, user1, user2;

    beforeEach(async function () {
        // Deploy the VotingDapp contract
        [candidate, candidate2, user1, user2] = await ethers.getSigners();
        VotingDapp = await ethers.getContractFactory("VotingDapp");
        votingDapp = await upgrades.deployProxy(VotingDapp, []);
        await votingDapp.waitForDeployment();
    });

    it("Should initialize the contract", async function () {
        const totalCandidates = await votingDapp.totalCandidates();
        const totalUsers = await votingDapp.totalUsers();

        expect(totalCandidates).to.equal(0);
        expect(totalUsers).to.equal(0);
    });

    it("Should add a candidate", async function () {
        await votingDapp.connect(candidate).registerUser();
        await votingDapp.addCandidate(1, "Arpit");

        const candid = await votingDapp.candidates(1);
        expect(candid.candidateId).to.equal(1);
        expect(candid.name).to.equal("Arpit");
        expect(candid.candidateAddress).to.equal(await candidate.getAddress());
    });

    it("Should register a user", async function () {
        await votingDapp.connect(user1).registerUser();

        const isRegistered = await votingDapp.isRegistered(await user1.getAddress());
        expect(isRegistered).to.be.true;

        const totalUsers = await votingDapp.totalUsers();
        expect(totalUsers).to.equal(1);
    });

    it("Should not allow registering the same user twice", async function () {
        await votingDapp.connect(user1).registerUser();

        await expect(
            votingDapp.connect(user1).registerUser()
        ).to.be.revertedWith("User already exists");
    });

    it("Should allow a registered user to vote", async function () {
        await votingDapp.connect(candidate).addCandidate(1, "Arpit");;
        await votingDapp.connect(user1).registerUser();

        await votingDapp.connect(user1).vote(1);

        const candid = await votingDapp.candidates(1);
        expect(candid.voteCount).to.equal(1);
    });

    it("Should not allow voting twice in the same election", async function () {
        await votingDapp.connect(candidate);
        await votingDapp.addCandidate(1, "Arpit");
        await votingDapp.connect(user1).registerUser();

        await votingDapp.connect(user1).vote(1);
        await expect(
            votingDapp.connect(user1).vote(1)
        ).to.be.revertedWith("You have already voted in this election");
    });

    it("Should not allow an unregistered user to vote", async function () {
        await votingDapp.connect(candidate);
        await votingDapp.addCandidate(1, "Arpit");

        await expect(
            votingDapp.connect(user1).vote(1)
        ).to.be.revertedWith("User not registered");
    });

    it("Should declare the correct election result", async function () {

        await votingDapp.connect(candidate).addCandidate(1, "Arpit");
        await votingDapp.connect(candidate2).addCandidate(2, "John");
        
        await votingDapp.connect(user1).registerUser();
        await votingDapp.connect(user2).registerUser();
        
        await votingDapp.connect(user1).vote(1); // Vote for Arpit
        
        await votingDapp.connect(user1).result();
        
        const winningCandidate = await votingDapp.results(1);
       

        expect(winningCandidate.candidateId).to.equal(1); // Assuming Arpit wins
    });

    it("Should reset votes after each election", async function () {
        await votingDapp.connect(candidate);
        await votingDapp.addCandidate(1, "Arpit");

        await votingDapp.connect(user1).registerUser();
        await votingDapp.connect(user1).vote(1);

        await votingDapp.result();

        const candid = await votingDapp.candidates(1);
        expect(candid.voteCount).to.equal(0);
    });
});
