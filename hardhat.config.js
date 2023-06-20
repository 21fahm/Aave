require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

const url = process.env.RPC_URL;
const mainnetUrl = process.env.MAINNET_RPC_URL;
const key = process.env.PRIV_KEY;
const etherscan = process.env.ETHERSCAN_API_KEY;
const marketCap = process.env.COINMARTKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.18" },
      { version: "0.6.6" },
      { version: "0.4.19" },
      { version: "0.6.12" },
      { version: "0.6.0" },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: mainnetUrl,
      },
    },
    sepolia: {
      url: url,
      accounts: [key],
      chainId: 11155111,
      blockConfirmation: 6,
    },
  },
  localhost: {
    url: "http://127.0.0.1:8545/",
    chainId: 31337,
  },
  etherscan: {
    apiKey: etherscan,
  },
  gasReporter: {
    enabled: true,
    currency: "KES",
    coinmarketcap: marketCap,
    outputFile: "gas_report.txt",
    noColors: true,
    token: "MATIC",
    gasPriceApi:
      "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
