// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateAuthenticator {
    struct Institution {
        string name;
        string institutionType;
        string registrationNumber;
        bool isAuthorized;
    }

    mapping(address => Institution) public institutions;
    address[] public institutionAddresses;

    event InstitutionAuthorized(
        address indexed institution,
        string name,
        string institutionType,
        string registrationNumber
    );

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function authorizeInstitution(
        address _institution,
        string memory _name,
        string memory _institutionType,
        string memory _registrationNumber
    ) external onlyOwner {
        require(_institution != address(0), "Invalid address");
        if (!institutions[_institution].isAuthorized) {
            institutionAddresses.push(_institution);
        }

        institutions[_institution] = Institution({
            name: _name,
            institutionType: _institutionType,
            registrationNumber: _registrationNumber,
            isAuthorized: true
        });

        emit InstitutionAuthorized(_institution, _name, _institutionType, _registrationNumber);
    }
}
