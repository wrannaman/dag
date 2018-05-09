const zmq = require('zeromq')
const logger = require('../logger')
const { abci_proxy_port, abci_proxy_host, pub_socket } = require('../config')
const { begin_block } = require('../types')

const subSock = zmq.socket('sub');
const pubSock = zmq.socket('pub');

/*
  Zeromq
    subSock needs to connect to the remote publisher.
    pubSock binds this app to a port for subs to connect to.
*/

subSock.connect(`tcp://${abci_proxy_host}:${abci_proxy_port}`);

/* Info */
subSock.subscribe('info.app_state');

/* Consensus */
subSock.subscribe('consensus.deliver_tx');

pubSock.bindSync(`tcp://0.0.0.0:${pub_socket}`);

logger.info(`Zeromq  - pub: tcp://0.0.0.0:${pub_socket} || sub: tcp://${abci_proxy_host}:${abci_proxy_port}`)

module.exports = { pubSock, subSock }
