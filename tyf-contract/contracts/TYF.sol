//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract TYF {

    mapping(address => uint256) public contributions;
    uint256 public totalContributors;
    uint256 public minimumContribution;
    uint256 public raisedAmount = 0;
    address public admin;
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool completed;
        uint256 numberOfVoters;
        mapping(address => bool) voters;
    }
    Request[] public requests;

    constructor() {
        minimumContribution = 0;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (contributions[msg.sender] == 0) {
            totalContributors++;
        }
        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }

    function getFundBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalFundsRaised() public view returns (uint256) {
        return raisedAmount;
    }

    function getUniqueContributors() public view returns (uint256) {
        return totalContributors;
    }

    function getLengthRequests() public view returns (uint256) {
        return requests.length;
    }

    function createSpendingRequest(
        string memory _description,
        address _recipient,
        uint256 _value
    ) public onlyAdmin {
        Request storage newRequest = requests.push();
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.numberOfVoters = 0;
        newRequest.completed = false;
    }

    function voteForRequest(uint256 index) public {
        Request storage thisRequest = requests[index];
        require(contributions[msg.sender] > 0);
        require(thisRequest.voters[msg.sender] == false);
        thisRequest.voters[msg.sender] = true;
        thisRequest.numberOfVoters++;
    }

    function makePayment(uint256 index) public onlyAdmin {
        Request storage thisRequest = requests[index];
        require(thisRequest.completed == false);
        require(thisRequest.numberOfVoters > totalContributors / 2); //more than 50% voted
        payable(thisRequest.recipient).transfer(thisRequest.value);
        thisRequest.completed = true;
    }
}
