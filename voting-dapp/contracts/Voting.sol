// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structure to represent a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store the contract creator's address
    address public owner;

    // Store a list of candidates
    Candidate[] public candidates;

    // Store a mapping of voter addresses to their votes
    mapping(address => bool) public voters;

    // Event to log vote casting
    event Voted(address indexed voter, uint indexed candidateId);

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor to initialize the contract
    constructor(string[] memory candidateNames) {
        owner = msg.sender;

        // Add candidates to the contract
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: candidateNames[i],
                voteCount: 0
            }));
        }
    }

    // Function to cast a vote for a candidate
    function vote(uint candidateId) public {
        // Check if the sender has not voted before
        require(!voters[msg.sender], "You have already voted");
        // Check if the candidate exists
        require(candidateId < candidates.length, "Invalid candidate");

        // Record the voter's choice
        voters[msg.sender] = true;
        // Increment the candidate's vote count
        candidates[candidateId].voteCount++;

        // Emit the Voted event
        emit Voted(msg.sender, candidateId);
    }

    // Function to get the total number of candidates
    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }
}
