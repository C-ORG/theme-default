var getUrlParameter = function getUrlParameter(sParam) {
  // https://stackoverflow.com/a/21903119/4986615
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};



let contractInstance = null;
let userAddress = null;
let accounts = [];

window.addEventListener('load', function() {


  if (typeof web3 !== 'undefined') {
  userAddress = web3.eth.defaultAccount;
  web1 = new Web3(web3.currentProvider);
  web0 = web3;
  if (getUrlParameter('address') != undefined){
    address = getUrlParameter('address');
  }
  contractInstance = new web1.eth.Contract(abi, address);
  $("#sc-address").val(address);

  accounts = [
      {addr:"0x932a4C51523f445f5bad6B46FB776786f3Ec2C54",
      name:"Organization",
      eth:0,
      tok:0},
      {addr:"0x1385b68c7BA5d1e430C91C324473662b8e7d646d",
      name:"Community",
      eth:0,
      tok:0},
      {addr:"0x23e6C5bCDC9b7f1bea81bd85b36179E850B6Da07",
      name:"Customer",
      eth:0,
      tok:0},
      {addr:"0xc7b1fCE73b02e580402CcE477C1fB14e2A21d056",
      name:"Investor",
      eth:0,
      tok:0},
      {addr:"0x79de435828B37B34Be669E17CCE8598CcEd00938",
      name:"Founder",
      eth:0,
      tok:0}
    ]


  update();

  } else {
     // Warn the user that they need to get a web0 browser
     // Or install MetaMask, maybe with a nice graphic.
  console.warn("need metamask");
  }
})


function buy() {
  const value = web0.toWei($("#buy-value").val(), 'ether');
  transaction = contractInstance.methods.buy().send({
                    'from': userAddress,
                    'gas': 4712388,
                    'gasPrice': 100000,
                    'value': value
    })
    .then();

  update();
}


function sell() {
  const value = web0.toWei($("#sell-value").val(), 'ether');
  contractInstance.methods.sell(value).send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000
  })
  .then();

  update();
}

function transfer() {
  const value = web0.toWei($("#transfer-amount").val(), 'ether');
  const address = $("#transfer-address").val();
  contractInstance.methods.transfer(address, value).send({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000
  })
  .then();

  update();

}


function connect() {
  address = $("#sc-address").val();
  contractInstance = new web1.eth.Contract(abi, address);
  update();
}

function revenue() {
  const value = web0.toWei($("#revenue-value").val(), 'ether');
  const batch = web3.createBatch();
  batch.add(contractInstance.methods.revenue().send.request({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000,
    value: value
  }, updateAccounts));

  accounts.forEach(function(account) {
    batch.add(contractInstance.methods.askDividend(account.addr).send.request({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000
    }, updateAccounts));
  });

  batch.execute();

  update();
}

function grant() {

  const value = web0.toWei($("#grant-value").val(), 'ether');

  const batch = web3.createBatch();
  batch.add(contractInstance.methods.storeDividend().send.request({
    from: userAddress,
    gas: 4712388,
    gasPrice: 100000,
    value: value
  }), updateAccounts);

  accounts.forEach(function(account) {
    batch.add(contractInstance.methods.askDividend(account.addr).send.request({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000
    }, updateAccounts));
  });

  batch.execute();

  update();
}



// ---------------------------------------------------------------------
//                              UPDATE
// ---------------------------------------------------------------------

function update() {

  updateBalance(userAddress);
  updateSellReserve();
  updateNumTokens();
  updateAccounts();
}


function updateBalance(address) {
  contractInstance.methods.balanceOf(address).call()
  .then((res) => {
    balance = parseFloat(web0.fromWei(res,"ether"));
    $("#balance-tok").html(balance.toFixed(3));
  });

  web1.eth.getBalance(address)
  .then((res) => {
    balance = parseFloat(web0.fromWei(res,"ether"));
    $("#balance-eth").html(balance.toFixed(3));
  });
}

function updateAccounts() {

  accounts.forEach(function (account, i) {

    contractInstance.methods.balanceOf(account.addr).call({from:account.addr})
    .then((res) => {
      account.tok = parseFloat(web0.fromWei(res)).toFixed(3);
    });

    web1.eth.getBalance(account.addr)
    .then((res) => {
      account.eth = parseFloat(web0.fromWei(res,"ether")).toFixed(3);
      updateTable();
    });

  });


}

function updateSellReserve() {
  contractInstance.methods.sellReserve().call()
  .then((res) => {
    $("#sell-reserve").html(parseFloat(web0.fromWei(res)).toFixed(3));
  });
}

function updateNumTokens() {
  contractInstance.methods.totalSupply().call()
  .then((res) => {
    $("#n-tokens").html(parseFloat(web0.fromWei(res)).toFixed(3));
  });
}

function updateTable() {

  const table = $("#sumup");

  const tbody = table.find('tbody');
  $('#sumup tr').each(function (i, row) {
    row.remove();
  });

  tbody.append('<tr><th scope="col">Name</th><th scope="col">Address</th><th scope="col">ETH</th><th scope="col">TOK</th></tr>');

  accounts.forEach(function (account, i) {
    tbody.append("<tr><th scope='row'>" + account.name + "</th><td>"+account.addr+"</td><td>"+account.eth+"</td><td>"+account.tok+"</td></tr>");
  });
}
