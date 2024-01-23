const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const apicache = require('apicache')
const mongoose = require('./config/db')
const redisClient = require('./config/redis')

const routes = require('./routes/index.route')

const app = express()

// * Database connection
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
    console.log('DB connected!')
})

// Get the Redis client instance
const cacheWithRedis = apicache.options({
    redisClient,
    debug: true,
    trackPerformance: true,
    statusCodes: {
        include: [200],
    },
}).middleware

// if redisClient option is defined, apicache will use redis client
// instead of built-in memory store
// app.use(cacheWithRedis("2 minutes"));

// * Cors
app.use(cors())

// Middleware to parse cookies
app.use(cookieParser())
// * Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('combined'))

// * Api routes
app.use('/api', routes)

app.get('/', (req, res) => {
    console.log('hello')
    res.send('hello')
})

app.use('*', (req, res) => {
    res.send('Route not found')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

module.exports = app
