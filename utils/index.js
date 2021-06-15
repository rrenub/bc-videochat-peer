const EC = require('elliptic').ec;
const cryptoHash = require('./cryptoHash')

const ec = new EC('secp256k1');

const verifySignature = ({publicKey, data, signature}) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

    return keyFromPublic.verify(data, signature);
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { ec, verifySignature, cryptoHash, getRandomInt }