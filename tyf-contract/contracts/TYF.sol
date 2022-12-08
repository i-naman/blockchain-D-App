//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract TYF is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public MAX_SUPPLY = 1000000; // Max supply of NFT
    uint256 public MAX_SUPPLY_USER = 2; // per user
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

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier contributor() {
        require(contributions[msg.sender] > 0);
        _;
    }

    constructor() ERC721("TYF-NFT", "TYF"){
        minimumContribution = 0;
        admin = msg.sender;
        _tokenIdCounter.increment(); // Start mint at ID 1
    }

    function safeMint(address to, string memory uri) public contributor {
        require(balanceOf(msg.sender) < MAX_SUPPLY_USER, "Max Mint per wallet reached");
        require(_tokenIdCounter.current() <= (MAX_SUPPLY), "I'm sorry we reached the cap");
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenIdCounter.increment();
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

    function voteForRequest(uint256 index) public contributor {
        Request storage thisRequest = requests[index];
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

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
