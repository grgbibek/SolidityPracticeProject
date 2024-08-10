const assert = require('assert');
const ganache = require('ganache');   //serve as a local etherium network 
const { Web3 } = require('web3');  //capital W in Web3 because it is a constructor 
const web3 = new Web3(ganache.provider()); // create instance of web3 and tells web3 to connect to ganache local network
const { abi, evm } = require("../compile");  //interface is the ABI and bytecode is the actual bytecode which have been compiled from solidity compiler

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  
  //use one of these accounts to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ["Hi there!"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });
  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});
