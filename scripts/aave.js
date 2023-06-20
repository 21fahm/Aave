const { getNamedAccounts, ethers } = require("hardhat");
const { getWeth, AMOUNT } = require("./getWeth");

async function main() {
  await getWeth();

  const { deployer } = await getNamedAccounts();
  const lendingPoolContract = await lendingPool(deployer);
  console.log(lendingPoolContract.address);

  await approveToken(
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    lendingPoolContract.address,
    AMOUNT,
    deployer
  );
  console.log("Depositing...");
  const deposit = await lendingPoolContract.deposit(
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    AMOUNT,
    deployer,
    0
  );
  await deposit.wait(1);
  console.log(`Deposit successful!😀`);

  let { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await getUserData(lendingPoolContract, deployer);
  const daiPrice = await getDaiPrice();

  const amountDaiToBorrow =
    availableBorrowsETH.toString() * 0.75 * (1 / daiPrice.toNumber());
  console.log(`You can borrow ${amountDaiToBorrow} DAI`);
  const amountToDaitoWei = ethers.utils.parseEther(
    amountDaiToBorrow.toString()
  );
  console.log(amountToDaitoWei);

  await borrowDai(
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    amountToDaitoWei,
    deployer,
    lendingPoolContract
  );
  console.log("You've borrowed");
  await getUserData(lendingPoolContract, deployer);

  await repayLoan(
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    amountToDaitoWei,
    deployer,
    lendingPoolContract
  );
  console.log("You have repaid the loan great!!!😀");
  console.log("Check data below");
  await getUserData(lendingPoolContract, deployer);
}

async function repayLoan(daiContract, amount, deployer, lendingPoolContract) {
  await approveToken(
    daiContract,
    lendingPoolContract.address,
    amount,
    deployer
  );

  const contract = await lendingPoolContract.repay(
    daiContract,
    amount,
    1,
    deployer
  );
  await contract.wait(1);
}

async function borrowDai(
  daiContract,
  amounttoBorrow,
  deployer,
  lendingPoolContract
) {
  const contract = await lendingPoolContract.borrow(
    daiContract,
    amounttoBorrow,
    1,
    0,
    deployer
  );
  await contract.wait(1);
}

async function lendingPool(deployer) {
  const contract = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    deployer
  );

  const getlendingPool = await contract.getLendingPool();
  const lendingPoolContract = await ethers.getContractAt(
    "ILendingPool",
    getlendingPool,
    deployer
  );
  return lendingPoolContract;
}

async function approveToken(erc20Address, spender, amountToSpend, deployer) {
  const contract = await ethers.getContractAt("IERC20", erc20Address, deployer);
  const approval = await contract.approve(spender, amountToSpend);
  await approval.wait(1);
  console.log("Approved!");
}

async function getUserData(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);
  console.log(
    `You have ${ethers.utils.formatEther(
      totalCollateralETH
    )} of ETH as collateral`
  );
  console.log(
    `You have ${ethers.utils.formatEther(
      availableBorrowsETH
    )} of ETH as available borrow`
  );
  console.log(
    `You have ${ethers.utils.formatEther(totalDebtETH)} of ETH as debt`
  );
  return { totalCollateralETH, totalDebtETH, availableBorrowsETH };
}

async function getDaiPrice() {
  const daiPrice = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  );
  const price = (await daiPrice.latestRoundData())[1];
  return price;
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
