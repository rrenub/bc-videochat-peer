const Transaction = require('.')

class TransactionPool {
    constructor() {
        this.transactionMap = {}
    }

    setTransaction(transaction) {
        console.log('añadiendo transacción', transaction)
        this.transactionMap[transaction.id] = transaction
    }

    clear() {
        this.transactionMap = {};
    }

    createTransaction({videoAppID, interventionID, interventionToken, signature}) {
        const newTransaction = new Transaction({videoAppID, interventionID, interventionToken, signature})
        console.log(newTransaction)
        
        return newTransaction
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter(transaction => 
            Transaction.validateTransaction(transaction)
        )
    }

    clearBlockchainTransactions({chain}) {
        for(let i=1; i<chain.length; i++) {
            const block = chain[i];

            for(let transaction of block.data) {
                if(this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id]
                }
            }
        }
    }
}

module.exports = TransactionPool