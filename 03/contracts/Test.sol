// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

contract Test {
    uint256[] public myArray;

    constructor() {
        myArray.push(1);
        myArray.push(10);
        myArray.push(30);
    }

    function getMyArray() public view returns (uint256[] memory) {
        return myArray;
    }

    function getArrayLength() public view returns (uint256) {
        return myArray.length;
    }

    function getFirstElement() public view returns (uint256) {
        return myArray[0];
    }
}
