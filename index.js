

let contractInstance = null;
let userAddress = null;
let balance = null;

window.addEventListener('load', function() {
  console.log("loading");

  if (typeof web3 !== 'undefined') {
  console.log("starting");
  userAddress = web3.eth.defaultAccount;
  web3js = new Web3(web3.currentProvider);
  contractInstance = new web3js.eth.Contract(abi, address);

   updateBalance(userAddress);
   updateSellReserve();
   updateNumTokens();

  } else {
     // Warn the user that they need to get a web3 browser
     // Or install MetaMask, maybe with a nice graphic.
  console.warn("need metamask");
  }
})


function buy() {
  const value = $("#buy-value").val();
  wei = web3.toWei(value, 'ether');
  transaction = contractInstance.methods.buy().send({
                    'from': userAddress,
                    'gas': 4712388,
                    'gasPrice': 100000,
                    'value': wei
    })
    .then(function() {
      updateBalance(userAddress);
      updateSellReserve();
      updateNumTokens();
    });
}
    // tx_receipt = w3.eth.getTransactionReceipt(tx_hash)['contractAddress']
        // return tx_receipt

  //  console.log('buy', userAddress);
  // const value = $("#buy-value").val();
  // contractInstance.methods.buy().send({from: userAddress,
  //                                          value: value,
  //                                          gas:100000})
  //
// }



function sell() {
  const value = $("#sell-value").val();
  contractInstance.methods.sell(value).send({from: userAddress,gas:100000})
  .then(function() {
    updateBalance(userAddress);
    updateSellReserve();
    updateNumTokens();
  });
}

function transfer() {
  const value = $("#transfer-amount").val();
  wei = web3.toWei(value, 'ether');
  const address = $("#transfer-address").val();
  contractInstance.methods.transfer(address, wei).send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000
  })
  .then(function() {
    updateBalance(userAddress);
    updateSellReserve();
    updateNumTokens();
  });
}

function updateBalance(address) {
  contractInstance.methods.balanceOf(address).call()
  .then((res) => {
    balance = parseFloat(web3.fromWei(res,"ether"));
    $("#balance").html(balance.toFixed(3));
  });
}

function updateSellReserve() {
  contractInstance.methods.sellReserve().call()
  .then((res) => {
    $("#sell-reserve").html(parseFloat(web3.fromWei(res)).toFixed(3));
  });
}

function updateNumTokens() {
  contractInstance.methods.totalSupply().call()
  .then((res) => {
    $("#n-tokens").html(parseFloat(web3.fromWei(res)).toFixed(3));
  });
}



// $(document).ready(function() {
//     updateBalance(userAddress);
//     updateSellReserve();
//     updateNumTokens();
// });
