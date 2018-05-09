/*

Consensus Connection - InitChain, BeginBlock, DeliverTx, EndBlock, Commit

*/
const logger = require('../logger')
const { begin_block } = require('../types')
const { zeromq } = require('../connections')
const { getState, setState } = require('../state')
const { sign } = require('../util')
const crypto = require('crypto');

const { folder_path, folder_name, create_new } = require('../config.json')
const { changeFile } = require('../util')

const subSock = zeromq.subSock;
const pubSock = zeromq.pubSock;

const main_path = `${folder_path}/${folder_name}`
const priv_validator_path = `${main_path}/priv_validator.json`
const genesis_path = `${main_path}/genesis.json`


const deliver_tx_incoming = (msg) => {
  logger.info('consensus - incoming - deliverTx', msg)
  msg = msg.toString()
  msg = JSON.parse(msg)
  console.log('what do I do now?', msg)

}


/* Incoming Messages */
subSock.on('message', function(topic, message) {
	topic = topic.toString()
	switch (topic) {
		/* Info */
		case 'consensus.deliver_tx':
			return deliver_tx_incoming(message)
			break;

		case 'info.set_option':
			return set_option_incoming(message)
			break;

		case 'info.query':
			return query_incoming(message)
			break;

		case 'info.echo':
			return echo_incoming(message)
			break;

		default:
			return unknown_incoming(message)
	}
});


/* Outgoing Messages */
module.exports = {
  // if init is already done, dont do anything
  safeInit: (round) => {
    // logger.info('consensus - safe init')
    const has_been_initialized = getState('initialized')
    if (has_been_initialized) return;
    setState("initialized", true);
    const validators = []
    const app_state_bytes = []
    pubSock.send(['consensus.init_chain', JSON.stringify({ validators, app_state_bytes })]);
  },
  /* This is the dag signaling to the abi that there is a new block */
  beginBlock: () => {
    // logger.info('consensus - beginBlock', )
    const md5sum = crypto.createHash('md5');
    const genesis = require(genesis_path)
    const priv_validator = require(priv_validator_path)
    const { chain_id, app_hash } = genesis;
    const {
      last_height,
      last_round,
      last_step,
      last_signature,
      last_signbytes,
    } = priv_validator

    /* Tendermint Example
    {
      hash: <Buffer 2f c6 17 78 06 a3 a9 9b 56 ac da 0a 38 2c 6b 31 37 e8 a3 98>,
      header:
      { chain_id: 'test-chain-3UdPTX',
        height: Long { low: 200, high: 0, unsigned: false },
        time: Long { low: 1525872410, high: 0, unsigned: false },
        last_block_id:
         {
           hash: <Buffer 0b 84 7b f4 e9 a3 d1 88 0a 27 e3 f8 98 9f ac 85 b7 9c e1 61>,
           parts: {
             total: 1,
             hash: <Buffer a5 ae 01 b7 e4 ae 17 17 ca df de 69 9c f2 97 95 a9 a7 26 41>
           }
         },
        last_commit_hash: <Buffer 0f 9c d2 f4 5b e4 35 57 e5 ed 51 36 6a e5 59 cf bf 33 e7 01>,
        app_hash: <Buffer 44 13 6f a3 55 b3 67 8a 11 46 ad 16 f7 e8 64 9e 94 fb 4f c2 1f e7 7e 83 10 c0 60 f6 1c aa ff 8a>
      }
    }
    */
    const header = {
      chain_id,
      height: last_height,
      time: Date.now(),
      last_block_hash: app_hash
    }

    const h = md5sum.update(JSON.stringify(header))
    const hash = md5sum.digest('hex')
    const begin_block_request = { hash, header }

    pubSock.send(['consensus.begin_block', JSON.stringify(begin_block_request)]);
    // bump last_height,
    changeFile('last_height', (last_height + 1), priv_validator_path)
    // change app_hash
    changeFile('app_hash', hash.toString('hex'), genesis_path)
  },
  deliverTx: (round) => {
    logger.info('consensus - deliverTx')
    const tx = JSON.stringify({})
    // Sign tx
    const signature = sign(tx)
    pubSock.send(['consensus.deliver_tx', JSON.stringify({ tx, signature })]);
  },
  endBlock: (round) => {
    logger.info('consensus - endBlock')
    const height = 0
    pubSock.send(['consensus.end_block', JSON.stringify({ height })]);
  },
  commit: (round) => {
    logger.info('consensus - commit')
    pubSock.send(['consensus.commit', null ]);
  },
}
