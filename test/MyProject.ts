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
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const allParents = await myproject.get_All_Parents();
    const firstParent = allParents[0];
    expect(firstParent.parentAddress).to.be.equal("0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc"); 
  });

  it("Should add an unique child ", async function () {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.childAddress).to.be.equal("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D"); 
  });

  it("Should get the message sender child", async function () {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const myChild = myproject.connect(signers[2]).getChild();
    expect((await myChild).childAddress).to.be.equal("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D");
  })

  it("Should get the message sender parent", async function () {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const myParent = myproject.connect(signers[1]).getParent();
    expect((await myParent).parentAddress).to.be.equal("0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
  })

  it("Should delete a child ", async function () {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const delete_My_Child = await myproject.connect(signers[1]).delete_Child_With_ID("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D");
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.childAddress).to.be.equal("0x0000000000000000000000000000000000000000"); 
  });

  it("Should add two parents and get them via get_All_Parents ", async function () {
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const parentInformation2 = await myproject.addParent("Test2","Parent2","0xE086BE6D51137948c7E1F45a4994BC041a711E56");
    const allParents = await myproject.get_All_Parents();
    const firstParent = allParents[0];
    const secondParent = allParents[1];
    expect(firstParent.parentAddress,secondParent.parentAddress).to.be.equal("0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc","0xE086BE6D51137948c7E1F45a4994BC041a711E56");
  });

  it("Should add two children and get them via get_All_Children ", async function () {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const childInformation2 = await myproject.connect(signers[1]).addChild("Test2","Child2","0xE835E7f4d8d04dd518C84d16B7FBcDa8c947Ede7",10);
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    const secondChild = allChildren[1];
    expect(firstChild.childAddress, secondChild.childAddress).to.be.equal("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D","0xE835E7f4d8d04dd518C84d16B7FBcDa8c947Ede7"); 
  });

  it("Should add a parent and then parent gets his/her children via get_Children_Of_Parent", async function () {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const childInformation2 = await myproject.connect(signers[1]).addChild("Test2","Child2","0xE835E7f4d8d04dd518C84d16B7FBcDa8c947Ede7",10);
    const allChildren_of_Parent = await myproject.get_Children_Of_Parent("0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const firstChild = allChildren_of_Parent[0];
    const secondChild = allChildren_of_Parent[1];
    expect(firstChild.childAddress, secondChild.childAddress).to.be.equal("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D","0xE835E7f4d8d04dd518C84d16B7FBcDa8c947Ede7"); 
  });

  it("Should transfer money from parent to child", async function() {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const transfered_amount = await myproject.connect(signers[1]).deposit_to_Child("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D" , { value: ethers.utils.parseUnits("5","wei")});
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.amount).to.be.equal(5);
  })

  it("Should transfer money from contract to child when the time is right", async function() {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const transfered_amount = await myproject.connect(signers[1]).deposit_to_Child("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D" , { value: ethers.utils.parseUnits("5","wei")});
    const withdraw = await myproject.child_Withdraws_Money("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",3,10);
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.amount).to.be.equal(2);
  })

  it("Should transfer money from contract to parent, this is the cancel function and child's amount will be decreased.", async function() {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const transfered_amount = await myproject.connect(signers[1]).deposit_to_Child("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D" , { value: ethers.utils.parseUnits("5","wei")});
    const withdraw = await myproject.connect(signers[1]).parent_Withdraws_Money("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D", 2);
    const allParents = await myproject.get_All_Parents();
    const firstParent = allParents[0];
    const parentBalance = await myproject.provider.getBalance("0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.amount).to.be.equal(3);
    //expect(parentBalance).to.be.equal(1e+22 - 2);
  })

  it("Should check roles", async function() {
    const signers = await ethers.getSigners();
    const parentInformation = await myproject.addParent("Test","Parent","0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const childInformation = await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    const theadmin = await myproject.getRole("0x1c80881894B2d90e163d844b91f82322B628a8Db");
    const myparent = await myproject.getRole("0xF9ecDb67535d2c7e74521B63e9dCA085b71Fdccc");
    const mychild = await myproject.getRole("0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D");
    const unregistered = await myproject.getRole("0xBed2367D2B8b5d253422983Cbd0705B0A2C16C66");
    expect(theadmin).to.be.equal(0);
    expect(myparent).to.be.equal(1);
    expect(mychild).to.be.equal(2);
    expect(unregistered).to.be.equal(3);
  })
});