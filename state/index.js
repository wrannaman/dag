const state = {
  initialized: false
}

module.exports.setState = (key, val) => {
  state[key] = val;
}
module.exports.getState = (prop = null) => {
  if (prop) return state[prop]
  return state
}
