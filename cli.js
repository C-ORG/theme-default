#!/usr/bin/env node

// blockchain
const Web3 = require('web3');
const http = require('http');
const blockchain = require('./lib/blockchain');
// command line interface
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const inquirer = require('./lib/inquirer');


// input for the Continuous Organisation
clear();
console.log(
  chalk.yellow(
    figlet.textSync('Continuous Organisation', { horizontalLayout: 'full' })
  )
);

const run = async () => {
  const organisation = await inquirer.askOrganisationName();
  const parameters = await inquirer.askParameters();
  slope = Math.round(parseFloat(parameters.slope)*1000);
  alpha = Math.round(parseFloat(parameters.alpha)*1000);
  beta = Math.round(parseFloat(parameters.beta)*1000);


  // initialize smart contract
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const asciiToHex = Web3.utils.asciiToHex;
  const filename = 'ethereum/contracts/ContinuousOrganisation.sol';
  const compiledCode = blockchain.compilation(filename);
  const byteCode = compiledCode.contracts[':ContinuousOrganisation'].bytecode;
  const abiDefinition = JSON.parse(compiledCode.contracts[':ContinuousOrganisation'].interface);

  const smartContract = new web3.eth.Contract(abiDefinition,
    {data: byteCode, from: organisation.address, gas: 4700000}
  );

  let deployedContract = null;
  smartContract.deploy({arguments: [slope, alpha, beta]})
  .send(function (error, transactionHash) {
    console.log('transactionHash', transactionHash);
  })
  .then((result) => {
    deployedContract = result;
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      let fileContents = '';
      try {
        fileContents = fs.readFileSync(__dirname + req.url, 'utf8');
      } catch (e) {
        fileContents = fs.readFileSync(__dirname + '/index.html', 'utf8');
      }
      res.end(
        fileContents.replace(
          /REPLACE_WITH_CONTRACT_ADDRESS/g,
          deployedContract.options.address
        ).replace(
          /REPLACE_WITH_ABI_DEFINITION/g,
          compiledCode.contracts[':ContinuousOrganisation'].interface
        )
      );
    });
    server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    server.listen(8000, () => {
      console.log('Listening on localhost:8000');
    });
  });
};

run();
