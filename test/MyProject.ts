import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyProject", function(){
  async function deploy() {
    
    const [owner, otherAccount] = await ethers.getSigners();
    const MyProject = await ethers.getContractFactory("MyProject");
    const myproject = await MyProject.connect(owner).deploy();
    return { myproject, owner, otherAccount };
  }

  describe("Deployment from proper address", function(){
    it("Should deployed from proper owner", async function () {
      const { myproject, owner } = await loadFixture(deploy);
      expect(myproject.address).to.be.properAddress;
    });
  });

  describe("AddFunctions", function(){
    describe("addParent", function(){

    });

    describe("addChild", function(){

    });
  });

  describe("GetFunctions", function(){
    describe("getOwner", function(){

    });

    describe("getParent", function(){

    });

    describe("getChild", function(){

    });

    describe("get_All_Children", function(){

    });

    describe("get_All_Parents", function(){

    });

    describe("get_Children_Of_Parent", function(){

    });

    describe("get_Balance_of_Contract", function(){

    });

    describe("getRole", function(){

    });
  });

  describe("delete_Child_With_ID", function(){
    
  });

  describe("deposit_to_Child", function(){
    
  });

  describe("WithdrawFunctions", function(){
    describe("parent_Withdraws_Money", function(){

    });

    describe("child_Withdraws_Money", function(){

    });
  });
});
