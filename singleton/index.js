const Blockchain = require('../data/blockchain');
const PubSub = require('../app/pubsub')
const TransactionPool = require('../data/transaction/transaction-pool')
const TransactionMiner = require('../app/transaction-miner')

//Initialize entities
const blockchain = new Blockchain();
const transactionPool = new TransactionPool()
const transactionMiner = new TransactionMiner({ blockchain, transactionPool})
const pubsub = new PubSub({ blockchain, transactionPool, transactionMiner });

//Getters for access them
const getBlockchain = () => blockchain;
const getTransactionPool = () => transactionPool;
const getPubSub = () => pubsub;

module.exports = {
    getBlockchain,
    getTransactionPool,
    getPubSub
}
