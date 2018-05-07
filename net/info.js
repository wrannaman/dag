/*

Info Connection - Info (app-state), SetOption, Query, Echo

*/
const logger = require('../logger')
const { begin_block } = require('../types')
const { zeromq } = require('../connections');
const subSock = zeromq.subSock;
const pubSock = zeromq.pubSock;


module.exports = {
  // if init is already done, dont do anything
  app_state: (round) => {
    logger.info('info - app_state (Info)')
    const verson = ''
    pubSock.send(['info.app_state', JSON.stringify({ verson })]);
  },
  /* This is the dag signaling to the abi that there is a new block */
  setOption: (round) => {
    logger.info('info - setOption')
    const key = ""
    const value = ""
    pubSock.send(['info.set_option', JSON.stringify({ key, value })]);
  },
  query: (round) => {
    logger.info('info - query')
    const query_object = {
      data: [],
      path: '',
      height: 0,
      prove: true,
    }
    pubSock.send(['info.query', JSON.stringify({ query_object })]);
  },
  echo: (round) => {
    logger.info('info - echo')
    const message = ""
    pubSock.send(['info.echo', JSON.stringify({ message })]);
  },
}
