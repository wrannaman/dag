const zmq = require('zeromq')
const logger = require('../logger')
const { abci_proxy_port, abci_proxy_host } = require('../config')
const { begin_block } = require('../types')

const subSock = zmq.socket('sub');
const pubSock = zmq.socket('pub');

pubSock.bindSync(`tcp://${abci_proxy_host}:${abci_proxy_port}`);

logger.info(`Zeromq connection on tcp://${abci_proxy_host}:${abci_proxy_port}`)

module.exports = { pubSock, subSock }
