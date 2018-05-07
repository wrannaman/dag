"use strict";
const forge = require('node-forge')
const fs = require('fs')
const uuidv4 = require('uuid/v4');
const mnGen = require('mngen');

const logger = require('./logger')
const { folder_path, folder_name, create_new, chain_id } = require('./config.json')
const main_path = `${folder_path}/${folder_name}`

const ed25519 = forge.pki.ed25519

/*
  Initializes node:
  1. Creates pub / priv key if none available

*/

const _config = () => {
  if (!fs.existsSync(`${main_path}/config.json`) || create_new) {
    logger.info("Initialize - new node, setting up configs")
    const password = mnGen.list(10).join(' ').substring(0,32);
    const seed = Buffer.from(password, 'utf8');
    const keypair = ed25519.generateKeyPair({ seed });
    const config = {
      publicKey: keypair.publicKey.toString('hex'),
      privateKey: keypair.privateKey.toString('hex'),
      nodeName: uuidv4(),
      mnemonic: password,
    }
    fs.writeFileSync(`${main_path}/config.json`, JSON.stringify(config, null, 4));
  }
  const config = require(`${main_path}/config.json`)
  return config;
}

const _genesis = () => {
  if (!fs.existsSync(`${main_path}/genesis.json`) || create_new) {
    logger.info("Initialize - new node, setting up genesis")

    const genesis = {
      genesis_time: new Date().getTime(),
      chain_id,
      validators: [],
      app_hash: ""
    }
    fs.writeFileSync(`${main_path}/genesis.json`, JSON.stringify(genesis, null, 4));
  }
  const genesis = require(`${main_path}/genesis.json`)
  return genesis;
}

const initialize = () => {
  try {
    // create folder if it doesnt exist
    const exists = fs.existsSync(main_path)
    if (!exists) fs.mkdirSync(main_path);

    /* config.json setup */
    // look for keys in config.json. Create if not exist
    const config = _config();
    const genesis = _genesis();

    return config;
  } catch (e) {
    console.log(e);
    logger.error("initialize error ", e)
    return false;
  }
}

module.exports = initialize;
