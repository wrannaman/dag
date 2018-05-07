/*

Consensus Connection - InitChain, BeginBlock, DeliverTx, EndBlock, Commit

*/
const logger = require('../logger')
const { begin_block } = require('../types')
const { zeromq } = require('../connections');
const subSock = zeromq.subSock;
const pubSock = zeromq.pubSock;


module.exports = {
  // if init is already done, dont do anything
  safeInit: (round) => {
    logger.info('consensus - safe init')
    const validators = []
    const app_state_bytes = []
    pubSock.send(['consensus.init_chain', JSON.stringify({ validators, app_state_bytes })]);
  },
  /* This is the dag signaling to the abi that there is a new block */
  beginBlock: (round) => {
    logger.info('consensus - beginBlock', )
    pubSock.send(['consensus.begin_block', JSON.stringify(begin_block())]);
  },
  deliverTx: (round) => {
    logger.info('consensus - deliverTx')
    const tx = ""
    pubSock.send(['consensus.deliver_tx', JSON.stringify({ tx })]);
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
