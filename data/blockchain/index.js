const Block = require('./block');
const { cryptoHash } = require('../../utils');
const Transaction = require('../transaction');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        })

        this.chain.push(newBlock)
    }

    validTransactionsData({chain}) {
        for(let i=1; i<chain.length; i++) {
            const block = chain[i]
            const transactionSet = new Set();

            for(let transaction of block.data) {
                if(!Transaction.validateTransaction(transaction)) {
                    console.error('Invalid transaction')
                    return false;
                }

                if(transactionSet.has(transaction)) {
                    console.error('Transaction is duplicated (appears more than once in the block')
                    return false;
                }

                transactionSet.add(transaction)
            }
        }
        return true
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))  {
            return false;
        }

        for(let i=1; i<chain.length; i++) {
            const {timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            //El hash del bloque anterior coincide con el hash almacenado del bloque anterior (cadena)
            if(lastHash !== actualLastHash){
                return false;
            } 

            const validatedHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data );

            //El hash del contenido del bloque fue calculado correctamente
            if(hash !== validatedHash) {
                return false;
            }

            if(lastDifficulty === difficulty) {
                return false;
            }
        }
        return true;
    }

    replaceChain(chain, validateTransactions, onSuccess) {
        //Se comprueba la longitud de la cadena recibida
        if(chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer')
            return;
        }

        //Se comprueba el contenido de cada bloque
        if(!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid')
            return;
        }

        //Se comprueba el contenido de cada transacción
        if(validateTransactions && !this.validTransactionsData({chain})) {
            console.error('The incoming chain has invalid transaction data')
            return;
        }

        if(onSuccess) onSuccess();

        console.log('Replacing chain with', chain)
        this.chain = chain
    }

    getTransaction({id}) {
        console.log('looking for transaction with id', id)
        for(let block of this.chain){
            for(let transaction of block.data) {
                console.log(transaction)
                if(transaction.id === id) {
                    return transaction;
                }
            }
        }
        return null;
    }
}

module.exports = Blockchain;