const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "e104f8dbb85c47738de878f55c504b19";
const mnemonic = "bronze youth green piano wash tunnel raccoon dawn liquid avocado pudding ship"
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};
