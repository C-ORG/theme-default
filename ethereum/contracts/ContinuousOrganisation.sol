pragma solidity ^0.4.24;

contract ContinuousOrganisation {

    /* The parameters of the Continuous Organisation. All are multiplied by 1000 */
    uint slope = 1000; // parametrize the buying linear curve
    uint alpha = 100; // fraction put into selling reserves when investors buy
    uint beta = 300; // fraction put into selling reserves when the CO has revenues
    uint gamma = 100; // coefficient put into taxing reserves when the CO has revenues

    /* The tokens of the Continuous Organisation */
    uint nTokens = 0;
    mapping(address => uint) public balances;
    address public owner; // owner of the smart contract
    uint public sellReserve = 0;


    /* Permission rights */
    modifier isOwner(address sender) { require(sender == owner); _; }

    /* Events */
    event UpdateTokens(uint tokens, uint sellReserve);


    /* This is the constructor. Solidity does not implement float number so we have to multiply constants by 1000 and rounding them before creating the smart contract.
    */
    constructor(uint paramA, uint paramAlpha, uint paramBeta, uint paramGamma) public {
        owner = msg.sender;
        slope = paramA;
        alpha = paramAlpha;
        beta = paramBeta;
        gamma = paramGamma;
    }

    /* Getters and setters */
    function setSlope(uint paramSlope) public isOwner(msg.sender) {
        slope = paramSlope;
    }
    function setAlpha(uint paramAlpha) public isOwner(msg.sender) {
        alpha = paramAlpha;
    }
    function setBeta(uint paramBeta) public isOwner(msg.sender) {
        beta = paramBeta;
    }
    function setGamma(uint paramGamma) public isOwner(msg.sender) {
        gamma = paramGamma;
    }

    /* Babylonian method for square root. See: https://ethereum.stackexchange.com/a/2913 */
    function sqrt(uint x)
        public
        pure
        returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    /* Minting and burning tokens */
    // #TODO protection against overflows
    function minting() public payable {
        // create tokens
        uint tokens = sqrt(2*msg.value/slope + nTokens*nTokens) - nTokens;
        balances[msg.sender] += tokens;
        nTokens += tokens;

        // redistribute tokens
        sellReserve += alpha*msg.value;
        owner.transfer((1-alpha)*msg.value);

        emit UpdateTokens(nTokens, sellReserve);
    }

    function burning(uint tokens) public {
        // check funds
        require(balances[msg.sender] >= tokens);
        balances[msg.sender] -= tokens;

        uint withdraw = sellReserve*tokens/nTokens/nTokens*(2*nTokens - tokens);
        sellReserve -= withdraw;
        msg.sender.transfer(withdraw);

        emit UpdateTokens(nTokens, sellReserve);
    }

    function revenues()
        public
        isOwner(msg.sender)
        payable {
        // create tokens
        uint tokens = sqrt(2*msg.value/slope + nTokens*nTokens) - nTokens;
        balances[owner] += tokens;
        nTokens += tokens;

        // redistribute tokens
        sellReserve += beta*msg.value;
        owner.transfer((1-beta-gamma)*msg.value);

        emit UpdateTokens(nTokens, sellReserve);
    }
}
