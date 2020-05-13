const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

// const url = 'mongodb://production:nPaefDmZyPxDjlos@cluster0-shard-00-00-pnkdj.mongodb.net:27017,cluster0-shard-00-01-pnkdj.mongodb.net:27017,cluster0-shard-00-02-pnkdj.mongodb.net:27017/iuvo_club?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'

const url = 'mongodb://iuvo_clubdeveloper:bjBwY8tI1WVBrTar@iuvo_club-developer-shard-00-00-pnkdj.mongodb.net:27017,iuvo_club-developer-shard-00-01-pnkdj.mongodb.net:27017,iuvo_club-developer-shard-00-02-pnkdj.mongodb.net:27017/iuvo_clubdeveloper?ssl=true&replicaSet=iuvo_club-developer-shard-0&authSource=admin'

// const url = 'mongodb://localhost/iuvo_club'
const options = {
    // useMongoClient: true
}

mongoose.connect(url, options)
    .then(() => {
        mongoose.connection.on('error', (err) => {
            console.log(`mongoose connection: ${err}`)
        })
        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB')
        })
    })
    .catch((err) => {
        console.log(`rejected promise ${err}`)
        mongoose.disconnect()
    })
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongodb: bye : )')
        process.exit(0)
    })
})
