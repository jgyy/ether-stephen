import Web3 from 'web3';
import HDWalletProvider from "@truffle/hdwallet-provider";
import dotenv from 'dotenv';
import { ok, strictEqual } from 'assert';
import { interfaces, bytecode } from '../compile.js';
import { describe, it, beforeEach } from 'mocha';

dotenv.config();
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.INFURA
);
const web3 = new Web3(provider);
let accounts;
let inbox;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(interfaces)
    .deploy({ data: bytecode, arguments: ['Hi There!'] })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    strictEqual(message, 'Hi There!');
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    strictEqual(message, 'bye');
  });
});

provider.engine.stop();
