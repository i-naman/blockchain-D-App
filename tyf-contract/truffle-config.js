
const HDWalletProvider = require("@truffle/hdwallet-provider");

const __MEMONIC__ = "ritual cricket pig chase street coach insane lens distance dynamic point smile";
const __INFURA_KEY__ = "https://goerli.infura.io/v3/ed91865f4c594eb796568aba3d5151f2";

module.exports = {

  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(__MEMONIC__, __INFURA_KEY__)
      },
      network_id: '5',
      gas: 4465030,
      // gasPrice: 10000000000,
    },
    //
    // Useful for deploying to a public network.
    // Note: It's important to wrap the provider as a function to ensure truffle uses a new provider every time.
    // goerli: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 5,       // Goerli's id
    //   confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17" // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  // CONTRACTS DIRECTORY
  contracts_directory: './contracts/',
  contracts_build_directory: "../TYF-app/src/ABI/"
};
