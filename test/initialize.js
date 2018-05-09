import test from 'ava'
import fs from 'fs'
import initialize from '../initialize'
const bip39 = require('bip39')
const ed25519 = require('ed25519')
const { folder_path, folder_name, create_new } = require('../config.json')
const main_path = `${folder_path}/${folder_name}`

test('create pub - priv key pair', t => {
	const mnemonic = "object ranch digital salt rose envelope object pipe supreme pave develop garden"
	const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer
	const pair = ed25519.MakeKeypair(seed.slice(0, 32));
	const message = JSON.stringify({ 1: "json", test: true, special: 'of course', nuu: 5 });
	const signature =  ed25519.Sign(new Buffer(message, 'utf8'), pair)
	t.is(signature.toString('hex'), '4c027d0738f4a4b02b0f877fcbac05628faee5b27026fdf2bfff1152daade48429e162b2d9feec6ecc1d994c958488f5f77fea57f65a95bb1344539354457a05')
	const verify = ed25519.Verify(new Buffer(message, 'utf8'), signature, pair.publicKey)
  t.is(verify, true)
});

test('config has all properties', t => {
  const config = require(`${main_path}/config.json`)
  t.is(typeof config.public_key, 'string')
  t.is(typeof config.private_key, 'string')
  t.is(typeof config.node_name, 'string')
  t.is(typeof config.mnemonic, 'string')
});

test('genesis has all properties', t => {
  const config = require(`${main_path}/genesis.json`)
  t.is(isNaN(config.genesis_time), false)
  t.is(typeof config.chain_id, 'string')
  t.is(Array.isArray(config.validators), true)
  t.is(typeof config.app_hash, 'string')
});

test('address book has all properties', t => {
  const config = require(`${main_path}/addr_book.json`)
  t.is(Array.isArray(config.addrs), true)
});

test('node_key has all properties', t => {
  const config = require(`${main_path}/node_key.json`)
	t.is(typeof config.public_key, 'string')
	t.is(typeof config.private_key, 'string')
	t.is(typeof config.node_name, 'string')
	t.is(typeof config.mnemonic, 'string')
});

test('priv_validator has all properties', t => {
  const config = require(`${main_path}/priv_validator.json`)
	t.is(typeof config.address, 'string')
	t.is(typeof config.public_key, 'string')
	t.is(typeof config.last_height, 'number')
	t.is(typeof config.last_round, 'number')
	t.is(typeof config.last_step, 'number')
	t.is(typeof config.last_signature, 'string')
	t.is(typeof config.last_signbytes, 'string')
	t.is(typeof config.private_key, 'string')
});
