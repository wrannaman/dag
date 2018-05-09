const fs = require('fs')
const bip39 = require('bip39')
const ed25519 = require('ed25519')

const { folder_path, folder_name, create_new } = require('../config.json')
const main_path = `${folder_path}/${folder_name}`

module.exports.changeFile = (key, value, file) => {
  const config = require(file);
  config[key] = value;
  fs.writeFileSync(file, JSON.stringify(config, null, 4));
}

module.exports.sign = (tx) => {
  const config = require(`${main_path}/config.json`)
  const mnemonic = config.mnemonic
  const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer
  const pair = ed25519.MakeKeypair(seed.slice(0, 32));
  const message = JSON.stringify(tx);
  const s = ed25519.Sign(new Buffer(message, 'utf8'), pair)
  const signature = s.toString('hex')
  return signature
}
