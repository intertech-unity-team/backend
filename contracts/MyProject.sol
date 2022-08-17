// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyProject {
    address owner;
    
    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns(address){
        return owner;
    }

    struct Parent {
        string name;
        string surname;
        address payable parentAddress;
        address[] children;
        
    }

    struct Child {
        string name;
        string surname;
        address payable childAddress;
        uint256 releaseTime;
        uint256 amount;

    }

    mapping(address => Parent) private parents;
    mapping(address => Child) private children;
    address[] public parentaddresslist;

    function addParent(string memory name, string memory surname, address payable parentAddress) public {
        Parent storage added_parent = parents[parentAddress];
        require( added_parent.parentAddress == address(0), "The parent has already stored." );
        added_parent.name = name;
        added_parent.surname = surname;
        added_parent.parentAddress = parentAddress;
        parentaddresslist.push(parentAddress);
    }

    function getParent() public view returns(Parent memory result) {
        Parent storage Message_Sender_Parent = parents[msg.sender];
        result = Message_Sender_Parent;
    }
    
    // onlyparent yap

    function addChild(string memory name, string memory surname, address payable childAddress, uint256 releaseTime ) public {
        Child storage added_child = children[childAddress];
        require( added_child.childAddress == address(0), "The child has already stored." );
        added_child.name = name;
        added_child.surname = surname;
        added_child.childAddress = childAddress;
        added_child.releaseTime = releaseTime;
    }

    function getChild() public view returns(Child memory result) {
        Child storage Message_Sender_Child = children[msg.sender];
        result = Message_Sender_Child;
    }

    function deleteChildWithID(address myaddress) public {
        Child storage selectedchild = children[myaddress];
        delete(selectedchild.name);
        delete(selectedchild.surname);
        delete(selectedchild.childAddress);
        delete(selectedchild.releaseTime);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can use this function");
        _;
    }
     
    function getAllParents() public view onlyOwner returns(Parent[] memory result) {
        result = new Parent[](parentaddresslist.length);
        for (uint i = 0; i < parentaddresslist.length; i++) {
            result[i] = parents[parentaddresslist[i]];
        }      
    }

    //getallchildren func  ekle

    function deposit_to_Child(address payable address_child) public payable {
        Child storage selected_child = children[address_child];
        selected_child.amount += msg.value;
    }

    function child_Withdraws_Money(address payable address_child, uint256 amount, uint256 releaseTime) public payable {
        Child storage selected_child = children[address_child];
        uint currentTime = block.timestamp;
        require(currentTime > releaseTime, "You are not 18 yet.");
        require(selected_child.amount > amount, "You don't have enough money");
        selected_child.amount -= amount;
        selected_child.childAddress.transfer(amount);
    }

    function parent_Withdraws_Money(address payable address_child, uint256 amount) public payable {
        Parent storage selected_parent = parents[msg.sender];
        Child storage selected_child = children[address_child];
        require(selected_child.amount > amount, "You don't have enough money");
        selected_child.amount -= amount;
        selected_parent.parentAddress.transfer(amount);
    }

    function get_Balance_of_Contract() public view returns(uint256){
        return address(this).balance;
    }

}

// find role bu wallet address ne? hiç yok mu? return tip: parent,kid,admin,unregistered, enum