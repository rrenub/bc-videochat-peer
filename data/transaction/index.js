const { verifySignature } = require("../../utils");

class Transaction {
    constructor({ videoAppID, interventionID, interventionToken, signature}) {
        this.id = interventionID;
        this.input = this.createInput({videoAppID, interventionToken, signature});
    }

    createInput({videoAppID, interventionToken, signature}) {
        return {
            timestamp: Date.now(),
            videoAppID,
            signature,
            interventionToken,
        }
    }

    static validateTransaction(transaction) {
        console.log('validate', transaction)
        const { input:{ videoAppID, signature, interventionToken }} = transaction;

        if(!verifySignature({publicKey: videoAppID, data: interventionToken, signature})) {
            console.error(`Invalid signature from ${videoAppID}`)
            return false;
        }

        console.log('La transacción es valida ', transaction.id)
        return true;
    }
}

module.exports = Transaction;