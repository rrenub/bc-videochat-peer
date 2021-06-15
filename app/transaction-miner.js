class TransactionMiner {
    constructor({ blockchain, transactionPool}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
    }

    mineTransactions() {
        //consulta las transacciones pendientes validas
        const validTransactions = this.transactionPool.validTransactions();

        if(validTransactions.length === 0) {
            console.log('There is no transactions to be mined')
            return;
        }

        //mina un bloque para las transacciones elegidas
        this.blockchain.addBlock({ data: validTransactions })

        //vacía el pool de transacciones tras el proceso de minado
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner