import test from 'ava'
import fs from 'fs'
import forge from 'node-forge'

import initialize from '../initialize'

const { folder_path, folder_name, create_new } = require('../config.json')
const main_path = `${folder_path}/${folder_name}`

const ed25519 = forge.pki.ed25519

test('create pub - priv key pair', t => {
	initialize();
  const config = require(`${main_path}/config.json`)
  // Test config
  const testMessage = JSON.stringify({ 1: "json", test: true, special: 'of course', nuu: 5 });
  const signature = ed25519.sign({
    message: testMessage,
    encoding: 'utf8',
    privateKey: Buffer.from(config.privateKey, 'hex')
  });
  const verified = ed25519.verify({
    message: testMessage,
    encoding: 'utf8',
    signature: signature,
    publicKey: Buffer.from(config.publicKey, 'hex')
  });
  t.is(verified, true)
});

test('config has all properties', t => {
  const config = require(`${main_path}/config.json`)
  t.is(typeof config.publicKey, 'string')
  t.is(typeof config.privateKey, 'string')
  t.is(typeof config.nodeName, 'string')
  t.is(typeof config.mnemonic, 'string')
});

test('genesis has all properties', t => {
  const config = require(`${main_path}/genesis.json`)
  t.is(isNaN(config.genesis_time), false)
  t.is(typeof config.chain_id, 'string')
  t.is(Array.isArray(config.validators), true)
  t.is(typeof config.app_hash, 'string')
});
