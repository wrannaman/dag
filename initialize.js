"use strict";
const fs = require('fs')
const uuidv4 = require('uuid/v4');
const bip39  = require('bip39')
const ed25519 = require('ed25519')
const logger = require('./logger')
const { folder_path, folder_name, create_new, chain_id } = require('./config.json')
const main_path = `${folder_path}/${folder_name}`

/*
  Initializes node configuration
*/

const _config = () => {
  if (!fs.existsSync(`${main_path}/config.json`) || create_new) {
    logger.info("Initialize - new node, setting up configs")
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const pair = ed25519.MakeKeypair(seed.slice(0, 32));
    const config = {
      public_key: pair.publicKey.toString('hex'),
      private_key: pair.privateKey.toString('hex'),
      node_name: uuidv4(),
      mnemonic,
    }
    fs.writeFileSync(`${main_path}/config.json`, JSON.stringify(config, null, 4));
  }
  const config = require(`${main_path}/config.json`)
  return config;
}
const _genesis = (node_key) => {
  /*
    Tendermint Example Genesis.json

    {
      "genesis_time": "0001-01-01T00:00:00Z",
      "chain_id": "test-chain-ODoJzP",
      "validators": [
        {
          "pub_key": {
            "type": "AC26791624DE60",
            "value": "zpv2QCG9dAmlQNmGQpIowVPJeFH0fp11egGafrBJCbM="
          },
          "power": 10,
          "name": ""
        }
      ],
      "app_hash": ""
    }

  */

  if (!fs.existsSync(`${main_path}/genesis.json`) || create_new) {
    logger.info("Initialize - new node, setting up genesis")

    delete node_key.privateKey
    delete node_key.mnemonic
    if (!node_key.power) node_key.power = 10
    const genesis = {
      genesis_time: new Date().getTime(),
      chain_id,
      validators: [node_key],
      app_hash: "",
      app_state: {}, // eg. initial distribution of tokens ({"account": "Bob", "coins": 5000})
    }
    fs.writeFileSync(`${main_path}/genesis.json`, JSON.stringify(genesis, null, 4));
  }
  const genesis = require(`${main_path}/genesis.json`)
  return genesis;
}
const _priv_validator = (config) => {
  /* Tendermint Examples
  // looks like this before a single block commit happens
  const before = {
    "address": "D0E5078255F46A2BF4D15A4AE2A0ED84041DB70E",
    "pub_key": {
      "type": "AC26791624DE60",
      "value": "zpv2QCG9dAmlQNmGQpIowVPJeFH0fp11egGafrBJCbM="
    },
    "last_height": 0,
    "last_round": 0,
    "last_step": 0,
    "priv_key": {
      "type": "954568A3288910",
      "value": "+clbYAEZ3th55b0tcPAbWM6Dn+2Tl6ju4cEZ1LkesFnOm/ZAIb10CaVA2YZCkijBU8l4UfR+nXV6AZp+sEkJsw=="
    }
  }

  // After a node, it looks like this
  const after = {
    "address": "D0E5078255F46A2BF4D15A4AE2A0ED84041DB70E",
    "pub_key": {
      "type": "AC26791624DE60",
      "value": "zpv2QCG9dAmlQNmGQpIowVPJeFH0fp11egGafrBJCbM="
    },
    "last_height": 46,
    "last_round": 0,
    "last_step": 3,
    "last_signature": {
      "type": "6BF5903DA1DB28",
      "value": "DaUUbjB2rxm6w2nWQqpsKSvzbVDWf3vMuHRZBHvgVjoS8WtpUBxJh4gAseqjaO8MNr6OIsj+O5zjqUjnkKLhDQ=="
    },
    "last_signbytes": "7B2240636861696E5F6964223A22746573742D636861696E2D4F446F4A7A50222C224074797065223A22766F7465222C22626C6F636B5F6964223A7B2268617368223A2237373531464539344243373439343832393732343142303935423338363141423935433043453939222C227061727473223A7B2268617368223A2234363945454445393842424130343142354542383539363638433435383235333131424230304435222C22746F74616C223A317D7D2C22686569676874223A34362C22726F756E64223A302C2274696D657374616D70223A22323031382D30352D30385431343A33393A33302E3535325A222C2274797065223A327D",
    "priv_key": {
      "type": "954568A3288910",
      "value": "+clbYAEZ3th55b0tcPAbWM6Dn+2Tl6ju4cEZ1LkesFnOm/ZAIb10CaVA2YZCkijBU8l4UfR+nXV6AZp+sEkJsw=="
    }
  }
  */

  if (!fs.existsSync(`${main_path}/priv_validator.json`) || create_new) {
    logger.info("Initialize - new node, setting up priv_validator")

    const priv_validator = {
      address: "",
      public_key: config.public_key,
      last_height: 0,
      last_round: 0,
      last_step: 0,
      last_signature: "",
      last_signbytes: "",
      private_key: config.private_key
    }
    fs.writeFileSync(`${main_path}/priv_validator.json`, JSON.stringify(priv_validator, null, 4));
  }
  const priv_validator = require(`${main_path}/priv_validator.json`)
  return priv_validator;
}
const _node_key = (config) => {
  /*
    Tendermint node_key.json
    {
      "priv_key":{
        "type":"954568A3288910",
        "value":"Jb1FQmj3dT7J5ZGQNbv8TyVvy6Jho1iI8T5mREzbM0skngdqqv4BLXi5dQOVsLziwvy0F39IuriPez4r0bbeBg=="
      }
    }
  */
  if (!fs.existsSync(`${main_path}/node_key.json`) || create_new) {
    logger.info("Initialize - new node, setting up node_keys")
    const node_key = {
      public_key: config.public_key,
      private_key: config.private_key,
      node_name: config.node_name,
      mnemonic: config.mnemonic,
    }
    fs.writeFileSync(`${main_path}/node_key.json`, JSON.stringify(node_key, null, 4));
  }
  const node_key = require(`${main_path}/node_key.json`)
  return node_key;
}
const _addr_book = () => {
  /*  Tendermint example
    {
    	"key": "2202f0626e1c67b7d47dde51",
    	"addrs": []
    }
  */
  if (!fs.existsSync(`${main_path}/addr_book.json`) || create_new) {
    logger.info("Initialize - new node, setting up addr_books")
    const addr_book = {
      addrs: [],
    }
    fs.writeFileSync(`${main_path}/addr_book.json`, JSON.stringify(addr_book, null, 4));
  }
  const addr_book = require(`${main_path}/addr_book.json`)
  return addr_book;
}
const initialize = () => {
  try {
    // create folder if it doesnt exist
    const exists = fs.existsSync(main_path)
    if (!exists) fs.mkdirSync(main_path);

    /* config.json setup */
    // look for keys in config.json. Create if not exist
    const config = _config();
    // // need to create a node key if not exists to add to genesis file
    const node_key = _node_key(config);
    const genesis = _genesis(node_key);
    const priv_validator = _priv_validator(config);
    const addr_book = _addr_book();

    return config;
  } catch (e) {
    console.log(e);
    logger.error("initialize error ", e)
    process.exit(1)
    return false;
  }
}

module.exports = initialize;
