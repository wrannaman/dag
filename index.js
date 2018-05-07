/* Names? */
/*
Director d
*/

"use strict";
const logger = require('./logger')
const Graph = require('./graph')
const Initilalize = require('./initialize')
const net = require('./net');

const init = async () => {
  logger.info("=============== New Run ==================")
  const initialized = await Initilalize();
}

init()
const graph = new Graph();
