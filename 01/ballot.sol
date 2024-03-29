// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;

contract Inbox {
    string public message;

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
