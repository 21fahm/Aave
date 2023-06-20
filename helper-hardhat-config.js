const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    wethContract: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  },
  1: {
    name: "Ethereum",
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    wethContract: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  31337: {
    name: "hardhat",
    wethContract: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
