const consensus = require('./consensus') // InitChain, BeginBlock, DeliverTx, EndBlock, Commit
const info = require('./info') // Info(app_state), SetOption, Query, Echo
const mempool = require('./mempool') // CheckTx
const logger = require('../logger')
const { block_interval } = require('../config.json')

const { safeInit, beginBlock, deliverTx, endBlock, commit } = consensus
const { app_state, setOption, query, echo } = info
const { check_tx } = mempool
const { getState, setState } = require('../state')
/*

Loop:
  BeginBlock -> DeliverTx -> EndBlock -> Commit

*/
let round = 0;
setInterval(() => {
  logger.info(`============== ${round} ================`);
  /* Consensus loop */
  if (!getState('initialized')) {
    safeInit(round);
  }
  beginBlock()
  deliverTx()
  // endBlock(round)
  // commit(round)

  /* Mempool Loop */
  // check_tx()

  /* Info Loop */
  // app_state()
  // setOption()
  // query()
  // echo()

  round++;
}, block_interval)
module.exports = { consensus, info, mempool }

/* Application */
// ABCI

/* Consensus / State Machine */
// Gossip


// list of rpc engpoints in tendermint
// Available endpoints:
// http://localhost:46657/dump_consensus_state
// http://localhost:46657/genesis
// http://localhost:46657/net_info
// http://localhost:46657/num_unconfirmed_txs
// http://localhost:46657/status
// http://localhost:46657/unconfirmed_txs
// http://localhost:46657/unsafe_stop_cpu_profiler
// http://localhost:46657/validators
//
// Endpoints that require arguments:
// http://localhost:46657/block?height=_
// http://localhost:46657/blockchain?minHeight=_&maxHeight=_
// http://localhost:46657/broadcast_tx_async?tx=_
// http://localhost:46657/broadcast_tx_sync?tx=_
// http://localhost:46657/dial_seeds?seeds=_
// http://localhost:46657/subscribe?event=_
// http://localhost:46657/unsafe_set_config?type=_&key=_&value=_
// http://localhost:46657/unsafe_start_cpu_profiler?filename=_
// http://localhost:46657/unsafe_write_heap_profile?filename=_
// http://localhost:46657/unsubscribe?event=_

// +-------------------------------------+
// v                                     |(Wait til `CommmitTime+timeoutCommit`)
// +-----------+                         +-----+-----+
// +----------> |  Propose  +--------------+          | NewHeight |
// |            +-----------+              |          +-----------+
// |                                       |                ^
// |(Else, after timeoutPrecommit)         v                |
// +-----+-----+                           +-----------+          |
// | Precommit |  <------------------------+  Prevote  |          |
// +-----+-----+                           +-----------+          |
// |(When +2/3 Precommits for block found)                  |
// v                                                        |
// +--------------------------------------------------------------------+
// |  Commit                                                            |
// |                                                                    |
// |  * Set CommitTime = now;                                           |
// |  * Wait for block, then stage/save/commit block;                   |
// +--------------------------------------------------------------------+
