/*

Info Connection - Info (app-state), SetOption, Query, Echo

*/
const logger = require('../logger')
const { begin_block } = require('../types')
const { zeromq } = require('../connections');
const subSock = zeromq.subSock;
const pubSock = zeromq.pubSock;

subSock.on('message', function(topic, message) {
	topic = topic.toString()
	switch (topic) {
		/* Info */
		case 'info.app_state':
			return app_state_incoming(message)
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
			return
	}
});


const app_state_incoming = (message) => {
  const m = JSON.parse(message.toString())
  console.log('M', m)
  if (m.app_hash === '' && m.height === 0) {
    logger.info('INFO - incoming - app_state - blank state')
  }
  logger.info('Info (Incoming) - app_state_incoming')
}

const set_option_incoming = (message) => {
  console.log('MESSAGE', message.toString())
  logger.info('Info (Incoming) - set_option_incoming')
}

const query_incoming = (message) => {
  console.log('MESSAGE', message.toString())
  logger.info('Info (Incoming) - query_incoming')
}

const echo_incoming = (message) => {
  console.log('MESSAGE', message.toString())
  logger.info('Info (Incoming) - echo_incoming')
}

const unknown_incoming = (message) => {
  console.log('MESSAGE', message.toString())
  logger.info('Info (Incoming) - unknown_incoming')
}


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
