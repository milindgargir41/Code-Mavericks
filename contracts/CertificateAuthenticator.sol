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
        string certificateHash; // Stores the hash of the certificate
        bytes32 dataHash; // Additional hash of certificate data for integrity
        bool isValid;
        address issuer;
    }

    // Institution address => Institution data
    mapping(address => Institution) public institutions;
    // Array of institution addresses
    address[] public institutionAddresses;
    // Certificate ID => Certificate data
    mapping(uint256 => Certificate) public certificates;
    // Certificate hash => Certificate ID (for external hash lookup)
    mapping(string => uint256) public hashToId;
    // Data hash => Certificate ID (for data integrity verification)
    mapping(bytes32 => uint256) public dataHashToId;
    // Set of all certificate hashes to prevent duplicates
    mapping(string => bool) public certificateHashExists;

    event InstitutionAuthorized(address indexed institution, string name, string institutionType, string registrationNumber);
    event CertificateIssued(uint256 indexed id, string recipientName, string courseName, address issuer, string certificateHash);
    event CertificateRevoked(uint256 indexed id);

    modifier onlyAuthorizedInstitution() {
        require(institutions[msg.sender].isAuthorized || msg.sender == owner(), "Not authorized institution");
        _;
    }

    constructor() {}

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

    function getInstitutionCount() external view returns (uint256) {
        return institutionAddresses.length;
    }

    function getInstitutionAddressByIndex(uint256 index) external view returns (address) {
        require(index < institutionAddresses.length, "Index out of bounds");
        return institutionAddresses[index];
    }

    function isAuthorized(address _institution) external view returns (bool) {
        return institutions[_institution].isAuthorized || _institution == owner();
    }

    function getInstitution(address _institution) external view returns (string memory, string memory, string memory, bool) {
        Institution memory inst = institutions[_institution];
        return (inst.name, inst.institutionType, inst.registrationNumber, inst.isAuthorized);
    }

    /**
     * @dev Generate a hash of certificate data for integrity verification
     */
    function generateDataHash(
        string memory _recipientName,
        string memory _courseName,
        string memory _issuerName,
        address _issuer
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_recipientName, _courseName, _issuerName, _issuer));
    }

    /**
     * @dev Issue a new certificate with hash storage
     */
    function issueCertificate(
        string memory _recipientName,
        string memory _courseName,
        string memory _issuerName,
        string memory _certificateHash
    ) external onlyAuthorizedInstitution returns (uint256) {
        require(bytes(_certificateHash).length > 0, "Certificate hash cannot be empty");
        require(!certificateHashExists[_certificateHash], "Certificate hash already exists");
        
        _certificateIds.increment();
        uint256 newId = _certificateIds.current();

        // Generate data hash for additional integrity verification
        bytes32 dataHash = generateDataHash(_recipientName, _courseName, _issuerName, msg.sender);

        certificates[newId] = Certificate({
            id: newId,
            recipientName: _recipientName,
            courseName: _courseName,
            issuerName: _issuerName,
            issueDate: block.timestamp,
            certificateHash: _certificateHash,
            dataHash: dataHash,
            isValid: true,
            issuer: msg.sender
        });

        // Store hash mappings
        hashToId[_certificateHash] = newId;
        dataHashToId[dataHash] = newId;
        certificateHashExists[_certificateHash] = true;

        emit CertificateIssued(newId, _recipientName, _courseName, msg.sender, _certificateHash);
        return newId;
    }

    /**
     * @dev Issue certificate with auto-generated hash
     */
    function issueCertificateWithAutoHash(
        string memory _recipientName,
        string memory _courseName,
        string memory _issuerName
    ) external onlyAuthorizedInstitution returns (uint256, string memory) {
        _certificateIds.increment();
        uint256 newId = _certificateIds.current();

        // Generate certificate hash automatically
        string memory autoHash = generateCertificateHash(_recipientName, _courseName, _issuerName, msg.sender, block.timestamp);
        
        // Generate data hash for additional integrity verification
        bytes32 dataHash = generateDataHash(_recipientName, _courseName, _issuerName, msg.sender);

        certificates[newId] = Certificate({
            id: newId,
            recipientName: _recipientName,
            courseName: _courseName,
            issuerName: _issuerName,
            issueDate: block.timestamp,
            certificateHash: autoHash,
            dataHash: dataHash,
            isValid: true,
            issuer: msg.sender
        });

        // Store hash mappings
        hashToId[autoHash] = newId;
        dataHashToId[dataHash] = newId;
        certificateHashExists[autoHash] = true;

        emit CertificateIssued(newId, _recipientName, _courseName, msg.sender, autoHash);
        return (newId, autoHash);
    }

    /**
     * @dev Generate a unique certificate hash
     */
    function generateCertificateHash(
        string memory _recipientName,
        string memory _courseName,
        string memory _issuerName,
        address _issuer,
        uint256 _timestamp
    ) public pure returns (string memory) {
        bytes32 hash = keccak256(abi.encodePacked(_recipientName, _courseName, _issuerName, _issuer, _timestamp));
        return bytes32ToString(hash);
    }

    /**
     * @dev Convert bytes32 to string
     */
    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i*2] = alphabet[uint256(uint8(_bytes32[i] >> 4))];
            str[1+i*2] = alphabet[uint256(uint8(_bytes32[i] & 0x0f))];
        }
        return string(str);
    }

    /**
     * @dev Verify a certificate by ID
     */
    function verifyCertificate(uint256 _id) external view returns (Certificate memory) {
        require(_id <= _certificateIds.current() && _id > 0, "Certificate does not exist");
        return certificates[_id];
    }

    /**
     * @dev Verify a certificate by its hash
     */
    function verifyCertificateByHash(string memory _certificateHash) external view returns (Certificate memory) {
        uint256 id = hashToId[_certificateHash];
        require(id > 0, "Certificate not found");
        return certificates[id];
    }

    /**
     * @dev Verify certificate data integrity using data hash
     */
    function verifyCertificateByDataHash(bytes32 _dataHash) external view returns (Certificate memory) {
        uint256 id = dataHashToId[_dataHash];
        require(id > 0, "Certificate not found");
        return certificates[id];
    }

    /**
     * @dev Check if a certificate hash exists
     */
    function doesCertificateHashExist(string memory _certificateHash) external view returns (bool) {
        return certificateHashExists[_certificateHash];
    }

    /**
     * @dev Get certificate hash by ID
     */
    function getCertificateHash(uint256 _id) external view returns (string memory) {
        require(_id <= _certificateIds.current() && _id > 0, "Certificate does not exist");
        return certificates[_id].certificateHash;
    }

    /**
     * @dev Validate certificate data integrity
     */
    function validateCertificateIntegrity(uint256 _id) external view returns (bool) {
        require(_id <= _certificateIds.current() && _id > 0, "Certificate does not exist");
        Certificate memory cert = certificates[_id];
        bytes32 expectedDataHash = generateDataHash(cert.recipientName, cert.courseName, cert.issuerName, cert.issuer);
        return cert.dataHash == expectedDataHash;
    }

    function revokeCertificate(uint256 _id) external onlyAuthorizedInstitution {
        require(_id <= _certificateIds.current() && _id > 0, "Certificate does not exist");
        require(certificates[_id].issuer == msg.sender || msg.sender == owner(), "Not authorized to revoke this certificate");

        certificates[_id].isValid = false;
        emit CertificateRevoked(_id);
    }

    function getTotalCertificates() external view returns (uint256) {
        return _certificateIds.current();
    }

    function getGovernmentAddress() public view returns (address) {
        return owner();
    }
}