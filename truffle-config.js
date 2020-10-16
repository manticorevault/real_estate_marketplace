const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "e104f8dbb85c47738de878f55c504b19";
const fs = require('fs');
const mnemonic = "bronze youth green piano wash tunnel raccoon dawn liquid avocado pudding ship"

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,
    },
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}