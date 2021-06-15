const express = require('express');
const axios = require('axios')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const Singleton = require('./singleton')

const isDevelopment = process.env.ENV === 'development'
const ROOT_NODE_ADDRESS = isDevelopment 
    ? process.env.ROOT_NODE_LOCAL_URL
    : process.env.ROOT_NODE_PROD_URL

const app = express();

app.use(express.json())
app.use(morgan(':method :url - status: :status - :response-time ms'))

app.get('/api/blocks', (req, res) => {
    res.json(Singleton.getBlockchain().chain);
});

app.get('/api/transaction-pool', (req, res) => {
    res.json(Singleton.getTransactionPool().transactionPool.transactionMap)
})

const syncWithRootState = () => {
    const url = `${ROOT_NODE_ADDRESS}/admin/sync-node`
    const payload = {
        id: process.env.NODE_ID
    }

    axios.post(url, payload).then((response) => {
        const { transactionPool, blockchain, redisUrl } = response.data
        console.log(response.data)
        console.log(redisUrl)
        console.log(JSON.stringify(blockchain))

        Singleton.getBlockchain().replaceChain(blockchain);
        Singleton.getTransactionPool().setMap(transactionPool)
        try {
            console.log('====', redisUrl)
            Singleton.getPubSub().initPubSub(redisUrl)
        } catch(error) {
            console.log('Error connecting to redis', error.message)
        }
    })
    .catch((error) => {
        console.log('error', error.message)
        console.log('El nodo no está autorizado')
    })
}

const PORT = process.env.PORT || process.env.DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Node ${process.env.NODE_ID} listening at port ${PORT}`)
    
    syncWithRootState();
})

