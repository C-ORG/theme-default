

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const asciiToHex = Web3.utils.asciiToHex;
const contractInstance = new web3.eth.Contract(ABI_DEFINITION, CONTRACT_ADDRESS);

let userAddress = null;
web3.eth.getAccounts()
.then((accounts) => {
  userAddress = accounts[2]
})
.then(function() {
  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();
});


function buy() {
  const value = $("#buy-value").val();
  contractInstance.methods.minting().send({from: userAddress,
                                           value: value,
                                           gas:100000})
  .then(function() {
    updateBalance(userAddress);
    updateSellReserve();
    updateNumTokens();
  });
}


function sell() {
  const value = $("#sell-value").val();
  contractInstance.methods.burning(value).send({from: userAddress,gas:100000})
  .then(function() {
    updateBalance(userAddress);
    updateSellReserve();
    updateNumTokens();
  });
}

function updateBalance(address) {
  contractInstance.methods.getBalance().call({from:address})
  .then((balance) => {
    $("#balance").html(balance);
  });
}

function updateSellReserve() {
  contractInstance.methods.getSellReserve().call()
  .then((res) => {
    $("#sell-reserve").html(parseInt(res)/1000);
  });
}

function updateNumTokens() {
  contractInstance.methods.getNumTokens().call()
  .then((res) => {
    $("#n-tokens").html(res);
  });
}



// $(document).ready(function() {
//     updateBalance(userAddress);
//     updateSellReserve();
//     updateNumTokens();
// });
