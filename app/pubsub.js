const redis = require('redis')
const { getRandomInt } = require('../utils/index')

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub {
    constructor({blockchain, transactionPool, transactionMiner}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.transactionMiner = transactionMiner;
    }

    initPubSub(redisUrl) {
        console.log('redis url', redisUrl)

        this.publisher = redis.createClient(redisUrl);
        this.subscriber = redis.createClient(redisUrl);

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message)
        })
    }

    handleMessage(channel, message) {
        console.log(`Message received: Channel: ${channel}. Message: ${message}.`)
        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    })
                })
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage.transaction)

                if(process.env.NODE_ID === parsedMessage.peerToMineID) {
                    this.transactionMiner.mineTransactions();
                    this.broadcastChain();
                } 

                break;
            default:
                return;
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach((channel) => {
            this.subscriber.subscribe(channel)
        })
    }

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel)
            });
        })
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction) {
        const peerToMine = getRandomInt(0, BLOCKCHAIN_PEERS.length-1)
        const peerToMineID = BLOCKCHAIN_PEERS[peerToMine]

        console.log('el peer que va a minar es', peerToMineID, ' de random', peerToMine)

        const message = {
            peerToMineID,
            transaction
        }

        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(message)
        })
    }


}

module.exports = PubSub
