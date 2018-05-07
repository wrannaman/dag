/*

Mempool Connection - CheckTx

*/
const logger = require('../logger')
const { begin_block } = require('../types')
const { zeromq } = require('../connections');
const subSock = zeromq.subSock;
const pubSock = zeromq.pubSock;


module.exports = {
  // if init is already done, dont do anything
  check_tx: (round) => {
    logger.info('mempool - check_tx')
    const tx = ''
    pubSock.send(['mempool.check_tx', JSON.stringify({ tx })]);
  },
}
