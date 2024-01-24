const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const apicache = require('apicache')
const sentry = require('@sentry/node')
const { ProfilingIntegration } = require('@sentry/profiling-node')
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

sentry.init({
    dsn: 'https://2bd20191da7fd5daa7b5cf0f55892fd1@o4505895995768832.ingest.sentry.io/4506627462004736',
    integrations: [
        // enable HTTP calls tracing
        new sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
})

// * Cors
app.use(cors())

// Middleware to parse cookies
app.use(cookieParser())
// * Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('combined'))

// The request handler must be the first middleware on the app
app.use(sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(sentry.Handlers.tracingHandler())
// The error handler must be registered before any other error middleware and after all controllers

app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!')
})

// * Api routes
app.use('/api', routes)

app.get('/', (req, res) => {
    console.log('hello')
    res.send('hello')
})

app.use('*', (req, res) => {
    res.send('Route not found')
})

app.use(sentry.Handlers.errorHandler())
// Optional fallthrough error handler

app.get('/debug-sentry', function mainHandler(req, res) {
    try {
        throw new Error('My first Sentry error!')
    } catch (error) {
        // Handle the error here
        console.error(error)
        res.status(500).send('Oops! Something went wrong.')
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

module.exports = app
