// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Transactions is ReentrancyGuard {
    uint256 transactionCount;

    event Transfer(
        address from,
        address to,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );

        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    function transferEther(
        address payable _receiver,
        string memory _message,
        string memory _keyword
    ) public payable nonReentrant {
        require(msg.sender.balance >= msg.value, "Ok, you've got enough money");
        (bool success, ) = _receiver.call{value: msg.value}("");
        require(success, "Transaction failed!");
        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                _receiver,
                msg.value,
                _message,
                block.timestamp,
                _keyword
            )
        );
        emit Transfer(
            msg.sender,
            _receiver,
            msg.value,
            _message,
            block.timestamp,
            _keyword
        );
    }
}
