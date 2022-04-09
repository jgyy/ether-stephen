import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import dotenv from 'dotenv';
import { interfaces, bytecode } from "./compile.js";

dotenv.config();
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.INFURA
);
const web3 = new Web3(provider);

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(interfaces)
    .deploy({ data: bytecode, arguments: ['Hi There!'] })
    .send({ from: accounts[0], gas: '1000000' });
    console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
