import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import solc from 'solc';

const lotteryPath = resolve(dirname(fileURLToPath(import.meta.url)), 'contracts', 'Lottery.sol');
const source = readFileSync(lotteryPath, 'utf-8');

const input = JSON.stringify({
  language: 'Solidity',
  sources: {
    contracts: {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
    },
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
});

export default JSON.parse(solc.compile(input)).contracts.contracts.Lottery;
export const interfaces = JSON.parse(solc.compile(input)).contracts.contracts.Lottery.abi;
export const bytecode = JSON.parse(solc.compile(input)).contracts.contracts.Lottery.evm.bytecode.object;
