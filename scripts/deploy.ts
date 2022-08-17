import { ethers } from "hardhat";

async function main() {
  const MyProject = await ethers.getContractFactory("MyProject");
  const myproject = await MyProject.deploy();

  await myproject.deployed();

  console.log("Myproject deployed to:", myproject.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});