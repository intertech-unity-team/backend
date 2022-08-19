import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyProject, MyProject__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("MyProject", function(){
  let myproject:MyProject
  let owner:SignerWithAddress

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
  })
  beforeEach(async () => {
    myproject = await new MyProject__factory(owner).deploy();
    await myproject.deployed();
  })

  it("Should deployed from the owner", async function () {
    expect(await myproject.getOwner()).to.equal(owner.address);
  });
  
  it("Should add an unique parent ", async function () {
    const parentInformation = await myproject.addParent("John","Doe","0xfE45fbb69d022b79b8A88694174c09232479a54D");
    const allParents = await myproject.get_All_Parents();
    const firstParent = allParents[0];
    expect(firstParent.parentAddress).to.be.equal("0xfE45fbb69d022b79b8A88694174c09232479a54D"); 
  });
});
