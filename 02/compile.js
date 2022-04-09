import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import solc from 'solc';

const inboxPath = resolve(dirname(fileURLToPath(import.meta.url)), 'contracts', 'Inbox.sol');
const source = readFileSync(inboxPath, 'utf-8');

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

export default JSON.parse(solc.compile(input)).contracts.contracts.Inbox;
export const interfaces = JSON.parse(solc.compile(input)).contracts.contracts.Inbox.abi;
export const bytecode = JSON.parse(solc.compile(input)).contracts.contracts.Inbox.evm.bytecode.object;
