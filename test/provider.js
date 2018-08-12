var Web3 = require('web3');
var expect    = require("chai").expect;
var fs = require("fs");
var solc = require('solc');

describe("Provider of ETH", function() {
  describe("Connection to the provider. Please launch ganache-cli separatly", function() {
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
      it("compiles the smart contract", function() {
          this.timeout(6000);
          code = fs.readFileSync('ethereum/contracts/ContinuousOrganisation.sol').toString()
          this.compiledCode = solc.compile(code)
          this.abiDefinition = JSON.parse(this.compiledCode.contracts[':ContinuousOrganisation'].interface)
          expect(this.abiDefinition).to.not.be.equal([]);

          COContract = web3.eth.contract(this.abiDefinition)
          byteCode = this.compiledCode.contracts[':ContinuousOrganisation'].bytecode
          deployedContract = COContract
      });
  });
});
