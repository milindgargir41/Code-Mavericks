// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CertificateAuthenticator is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _certificateIds;

    struct Institution {
        string name;
        string institutionType;
        string registrationNumber;
        bool isAuthorized;
    }

    struct Certificate {
        uint256 id;
        string recipientName;
        string courseName;
        string issuerName;
        uint256 issueDate;
        string ipfsHash;
        bool isValid;
        address issuer;
    }

    // Institution address => Institution data
    mapping(address => Institution) public institutions;
    // Array of institution addresses
    address[] public institutionAddresses;
    // Certificate ID => Certificate data
    mapping(uint256 => Certificate) public certificates;
    // IPFS hash => Certificate ID
    mapping(string => uint256) public hashToId;

    event InstitutionAuthorized(address indexed institution, string name, string institutionType, string registrationNumber);
    event CertificateIssued(uint256 indexed id, string recipientName, string courseName, address issuer);
    event CertificateRevoked(uint256 indexed id);

    modifier onlyAuthorizedInstitution() {
        require(institutions[msg.sender].isAuthorized || msg.sender == owner(), "Not authorized institution");
        _;
    }

    constructor() {}

    /**
     * @dev Authorize an institution with metadata. Only owner (government) can call.
     */
    function authorizeInstitution(
        address _institution,
        string memory _name,
        string memory _institutionType,
        string memory _registrationNumber
    ) external onlyOwner {
        require(_institution != address(0), "Invalid address");
        // Only add to array if not already present
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

    /**
     * @dev Get the total number of authorized institutions.
     */
    function getInstitutionCount() external view returns (uint256) {
        return institutionAddresses.length;
    }

    /**
     * @dev Get institution address by index.
     */
    function getInstitutionAddressByIndex(uint256 index) external view returns (address) {
        require(index < institutionAddresses.length, "Index out of bounds");
        return institutionAddresses[index];
    }

    /**
     * @dev Check if an address is an authorized institution.
     */
    function isAuthorized(address _institution) external view returns (bool) {
        return institutions[_institution].isAuthorized || _institution == owner();
    }

    /**
     * @dev Get institution metadata.
     */
    function getInstitution(address _institution) external view returns (string memory, string memory, string memory, bool) {
        Institution memory inst = institutions[_institution];
        return (inst.name, inst.institutionType, inst.registrationNumber, inst.isAuthorized);
    }

    /**
     * @dev Issue a new certificate. Only authorized institutions can call.
     */
    function issueCertificate(
        string memory _recipientName,
        string memory _courseName,
        string memory _issuerName,
        string memory _ipfsHash
    ) external onlyAuthorizedInstitution returns (uint256) {
        _certificateIds.increment();
        uint256 newId = _certificateIds.current();

        certificates[newId] = Certificate({
            id: newId,
            recipientName: _recipientName,
            courseName: _courseName,
            issuerName: _issuerName,
            issueDate: block.timestamp,
            ipfsHash: _ipfsHash,
            isValid: true,
            issuer: msg.sender
        });

        hashToId[_ipfsHash] = newId;

        emit CertificateIssued(newId, _recipientName, _courseName, msg.sender);
        return newId;
    }

    /**
     * @dev Verify a certificate by ID.
     */
    function verifyCertificate(uint256 _id) external view returns (Certificate memory) {
        require(_id <= _certificateIds.current() && _id > 0, "Certificate does not exist");
        return certificates[_id];
    }

    /**
     * @dev Verify a certificate by IPFS hash.
     */
    function verifyCertificateByHash(string memory _ipfsHash) external view returns (Certificate memory) {
        uint256 id = hashToId[_ipfsHash];
        require(id > 0, "Certificate not found");
        return certificates[id];
    }

    /**
     * @dev Revoke a certificate. Only the issuer or owner can call.
     */
    function revokeCertificate(uint256 _id) external onlyAuthorizedInstitution {
        require(_id <= _certificateIds.current() && _id > 0, "Certificate does not exist");
        require(certificates[_id].issuer == msg.sender || msg.sender == owner(), "Not authorized to revoke this certificate");

        certificates[_id].isValid = false;
        emit CertificateRevoked(_id);
    }

    /**
     * @dev Get the total number of certificates issued.
     */
    function getTotalCertificates() external view returns (uint256) {
        return _certificateIds.current();
    }

    /**
     * @dev Returns the government (owner) address.
     */
    function getGovernmentAddress() public view returns (address) {
        return owner();
    }
}
