'use strict';

let types = {
    block: {
        description:'A block in the DAG',
        props: {
            header: ['header', 'required'],
            data: ['number', 'required'],
            lastCommit: ['string', 'required'],
        }
    },
    header: {
        description:'Header of the block',
        props: {
            userid: ['number', 'required'],
            content: ['string', 'require'],
            expire: ['date', 'required'],
            chainId: ['string',  'name of the blockchain, e.g. "tendermint"']
            height: ['number', 'sequential block number starting with 1']
            time: ['time', 'local time of the proposer who proposed this block']
            lastBlockHash: ['array', 'block hash of the previous block at height Height-1']
            lastBlockParts: ['PartSetHeader', 'partset header of the previous block']
            stateHash: ['array', 'The state hash is the Simple Tree hash of the state\'s fields (e.g. BondedValidators, UnbondingValidators, Accounts, ValidatorInfos, and NameRegistry) encoded as a list of KVPairs. This state hash is recursively included in the block Header and thus the block hash indirectly.']
        }
    },
    data: {
      description: 'data prop in the block, array of transactions',
      props: {
        txs: ['array', 'Array of transactions. A transaction is any sequence of bytes. It is up to your ABCI application to accept or reject transactions.']
      }
    },
    commit: {
      description: 'Array of precommited votes',
      props: {
        preCommits: ['array', 'Array of precommit votes']
      }
    },
    vote: {
      description: '',
      props: {
        height: ['int', 'The block height being decided on'],
        round: ['int', 'The consensus round number, starting with 0'],
        type: ['byte', 'The type of vote, either a prevote or a precommit'],
        blockHash: ['byte', 'The block hash of a valid block, or nil. The block hash is the Simple Tree hash of the fields of the block Header encoded as a list of KVPairs.'],
        blockParts: ['PartSetHeader', 'The corresponding partset header, or x0000 if the block hash is nil'],
        signature: ['Signature', ' The signature of this Vote\'s sign-bytes']
      }
    }
}

module.exports = types;
