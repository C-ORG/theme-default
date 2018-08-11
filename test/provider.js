var Web3 = require('web3');
var expect    = require("chai").expect;
var fs = require("fs");
var solc = require('solc');

describe("Provider of ETH", function() {
  describe("Connection to the provider", function() {
    it("connects to the provider", function() {
        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        var firstAccount = null;
        // check whether we reach an account
        firstAccount = web3.eth.getAccounts().then( function(accounts) {
            return accounts[0];
        });

      expect(firstAccount).to.not.be.null;
    });
  });

  describe("Compilation", function() {
      it("compile the smart contract", function() {

          code = fs.readFileSync('ethereum/contracts/ContinuousOrganisation.sol').toString()
          compiledCode = solc.compile(code)
          abiDefinition = JSON.parse(compiledCode.contracts[':ContinuousOrganisation'].interface)
          expect(abiDefinition).to.not.be.equal([]);
      });
  });
});
