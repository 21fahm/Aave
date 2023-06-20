const { getNamedAccounts, ethers } = require("hardhat");

const AMOUNT = ethers.utils.parseEther("0.1");

async function getWeth() {
  const { deployer } = await getNamedAccounts();
  const contract = await ethers.getContractAt(
    "IWeth",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    deployer
  );
  const tx = await contract.deposit({ value: AMOUNT });
  await tx.wait(1);
  const balanceOf = await contract.balanceOf(deployer);
  console.log(`Successful!😄. Balance is ${balanceOf} WETH`);
}

module.exports = { getWeth, AMOUNT };
