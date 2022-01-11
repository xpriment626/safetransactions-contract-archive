// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract SafeTX {

    address payable public walletOwner;
    mapping(address => bool) registeredAddies;

    constructor() {
        walletOwner = payable(msg.sender);
    }

    receive() external payable {}

    function deposit() external payable {}

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function addKnown(address _myAddy) public ownerControl {
        registeredAddies[_myAddy] = true;
    }

    function withdraw(address payable _to, uint256 _amount) public payable ownerControl returns(bool _status) {
        require(registeredAddies[_to] == true, "Not a registered address");
        require(_amount <= address(this).balance, "insufficient funds");
        _to.transfer(_amount);
        return true;
    }

    modifier ownerControl {
        require(msg.sender == walletOwner, "You are not the owner of this wallet");
        _;
    }
}