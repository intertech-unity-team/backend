import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyProject, MyProject__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("MyProject", function(){
  let myproject:MyProject
  let owner:SignerWithAddress
  let signers:SignerWithAddress[]
  let allParents:MyProject.ParentStructOutput[]
  let firstParent:MyProject.ParentStructOutput
  let secondParent:MyProject.ParentStructOutput
  let allChildren:MyProject.ChildStructOutput[]
  let firstChild:MyProject.ChildStructOutput
  let secondChild:MyProject.ChildStructOutput

  before(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    
  })
  beforeEach(async () => {
    myproject = await new MyProject__factory(owner).deploy();

    await myproject.deployed();
    await myproject.addParent("Test","Parent",signers[1].address);
    await myproject.addParent("Test2","Parent2",signers[3].address);
    await myproject.connect(signers[1]).addChild("Test","Child","0x7843D7A9896384Fcb2dB110A5613Fa7245257d1D",10);
    await myproject.connect(signers[1]).addChild("Test2","Child2","0xE835E7f4d8d04dd518C84d16B7FBcDa8c947Ede7",10);

    allParents = await myproject.get_All_Parents();
    firstParent = allParents[0];
    secondParent = allParents[1];
    allChildren = await myproject.get_All_Children();
    firstChild = allChildren[0];
    secondChild = allChildren[1]
    
  })

  it("Should deployed from the owner", async function () {
    expect(await myproject.getOwner()).to.equal(owner.address);
  });
  
  it("Should check parents ", async function () {
    expect(firstParent.parentAddress,secondParent.parentAddress).to.be.equal(signers[1].address,signers[3].address);
  });

  it("Should check children ", async function () {
    expect(firstChild.childAddress, secondChild.childAddress).to.be.equal(signers[2].address,signers[4].address); 
  });

  it("Should get the message sender child", async function () {
    const myChild = myproject.connect(signers[2]).getChild();
    expect((await myChild).childAddress).to.be.equal(signers[2].address);
  })

  it("Should get the message sender parent", async function () {
    const myParent = myproject.connect(signers[1]).getParent();
    expect((await myParent).parentAddress).to.be.equal(signers[1].address);
  })

  it("Should delete a child ", async function () {
    await myproject.connect(signers[1]).delete_Child_With_ID(signers[2].address);
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.childAddress).to.be.equal("0x0000000000000000000000000000000000000000"); 
  });

  it("Should check if parent can get his/her children via get_Children_Of_Parent", async function () {
    const allChildren_of_Parent = await myproject.get_Children_Of_Parent(signers[1].address);
    const firstChild = allChildren_of_Parent[0];
    const secondChild = allChildren_of_Parent[1];
    expect(firstChild.childAddress, secondChild.childAddress).to.be.equal(signers[2].address,signers[4].address); 
  });

  it("Should transfer money from parent to child", async function() {
    await myproject.connect(signers[1]).deposit_to_Child(signers[2].address , { value: ethers.utils.parseEther("5")});
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.amount).to.be.equal(ethers.utils.parseEther("5"));
    // allchildren ve firstchild silince bozuluyo??
  })

  it("Should transfer money from contract to child when the time is right", async function() {
    await myproject.connect(signers[1]).deposit_to_Child(signers[2].address , { value: ethers.utils.parseEther("5")});
    await myproject.child_Withdraws_Money(signers[2].address ,ethers.utils.parseEther("3"),10);
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.amount).to.be.equal(ethers.utils.parseEther("2"));
  })

  it("Should transfer money from contract to parent, this is the cancel function and child's amount will be decreased.", async function() {
    await myproject.connect(signers[1]).deposit_to_Child(signers[2].address , { value: ethers.utils.parseEther("5")});
    const withdraw = await myproject.connect(signers[1]).parent_Withdraws_Money(signers[2].address, ethers.utils.parseEther("2"));
    const allParents = await myproject.get_All_Parents();
    const firstParent = allParents[0];
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.amount).to.be.equal(ethers.utils.parseEther("3"));
  })

  it("Should check roles", async function() {
    const theadmin = await myproject.getRole(signers[0].address);
    const myparent = await myproject.getRole(signers[1].address);
    const mychild = await myproject.getRole(signers[2].address);
    const unregistered = await myproject.getRole(signers[5].address);
    expect(theadmin).to.be.equal(0);
    expect(myparent).to.be.equal(1);
    expect(mychild).to.be.equal(2);
    expect(unregistered).to.be.equal(3);
  })

  it("Should get the balance of the contract", async function () {
    await myproject.connect(signers[1]).deposit_to_Child(signers[2].address , { value: ethers.utils.parseEther("5")});
    const myBalance = await myproject.get_Balance_of_Contract();
    expect(myBalance).to.be.equal(ethers.utils.parseEther("5"));
  })

  it("Should update the child information",async function (){
    await myproject.connect(signers[1]).update_Child_with_ID("Updated","FirstChild",signers[2].address,15);
    const allChildren = await myproject.get_All_Children();
    const firstChild = allChildren[0];
    expect(firstChild.name).to.be.equal("Updated");
  })
});