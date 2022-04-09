import Web3 from 'web3';
import HDWalletProvider from "@truffle/hdwallet-provider";
import dotenv from 'dotenv';
import assert from 'assert';
import { interfaces, bytecode } from '../compile.js';
import { describe, it, beforeEach } from 'mocha';

dotenv.config();
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.INFURA
);
const web3 = new Web3(provider);
let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(interfaces)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.0011', 'ether')
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    assert(accounts[0] == players[0]);
    assert(players.length == 1);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.0011', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.0011', 'ether')
    });
  
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
  
    assert(accounts[0] == players[0]);
    assert(accounts[1] == players[1]);
    assert(players.length == 2);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and resets the player array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.0011', 'ether')
    });
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('0.001', 'ether'));
  });
});

provider.engine.stop();
