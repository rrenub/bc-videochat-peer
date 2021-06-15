const { GENESIS_DATA, MINING_DIFFICULTY } = require('./config');
const { cryptoHash } = require('../../utils');
const hexToBinary = require('hex-to-binary')


class Block {
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new Block(GENESIS_DATA)
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;
        
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = MINING_DIFFICULTY;
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
        } while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({ timestamp, lastHash, data, difficulty, nonce, hash })
    }
}

module.exports = Block