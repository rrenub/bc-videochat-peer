const MINING_DIFFICULTY = 10;

const GENESIS_DATA = {
    timestamp: 1622079334,
    lastHash: '----',
    hash: 'first-hash',
    difficulty: MINING_DIFFICULTY,
    nonce: 0,
    data: [],
}

module.exports = { 
    GENESIS_DATA, 
    MINING_DIFFICULTY
}