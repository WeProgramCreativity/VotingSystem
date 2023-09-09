// Import Web3.js library (make sure to include it in your project)
const Web3 = require('web3');

// Connect to a local Ethereum node (Ganache in this example)
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Define the Ethereum contract address and ABI (update these with your actual contract details)
const contractAddress = '0xYourContractAddress';
const contractABI = [
    // Include your contract's ABI here
];

// Create an instance of the contract
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to populate the candidate list in the voting form
async function populateCandidates() {
    const candidateList = await votingContract.methods.getCandidateList().call();
    const select = document.getElementById('candidates');

    for (let i = 0; i < candidateList.length; i++) {
        const candidate = candidateList[i];
        const option = document.createElement('option');
        option.text = candidate;
        option.value = i;
        select.appendChild(option);
    }
}

// Function to handle form submission and cast votes
async function vote() {
    const candidateId = document.getElementById('candidates').value;
    const voterAddress = '0xYourVoterAddress'; // Replace with the actual voter's Ethereum address

    try {
        const alreadyVoted = await votingContract.methods.hasVoted(voterAddress).call();

        if (alreadyVoted) {
            alert('You have already voted.');
            return;
        }

        await votingContract.methods.vote(candidateId).send({ from: voterAddress });
        alert('Your vote has been cast successfully.');

        // Refresh the results after voting
        displayResults();
    } catch (error) {
        console.error(error);
        alert('An error occurred while processing your vote.');
    }
}

// Function to display voting results
async function displayResults() {
    const candidateList = await votingContract.methods.getCandidateList().call();
    const candidateVotes = [];

    for (let i = 0; i < candidateList.length; i++) {
        const voteCount = await votingContract.methods.getVoteCount(i).call();
        candidateVotes.push({ name: candidateList[i], votes: voteCount });
    }

    const resultsList = document.getElementById('candidate-list');
    resultsList.innerHTML = '';

    candidateVotes.forEach(candidate => {
        const listItem = document.createElement('li');
        listItem.textContent = `${candidate.name}: ${candidate.votes} votes`;
        resultsList.appendChild(listItem);
    });
}

// Populate the candidate list when the page loads
populateCandidates();

// Attach the vote function to the form submission
document.getElementById('voting-form').addEventListener('submit', function (event) {
    event.preventDefault();
    vote();
});
