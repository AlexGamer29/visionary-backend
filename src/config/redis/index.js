const redis = require('redis')
const { REDIS_URL } = require('..')

const redisClient = redis.createClient({
    url: REDIS_URL,
})

redisClient.connect()

const redisWrapper = {
    connected: redisClient.isOpen,
    del: (keys) => redisClient.del(keys),
    hgetall: (key, fn) => {
        redisClient
            .hGetAll(key)
            .then((resp) => {
                fn(null, resp)
            })
            .catch((err) => {
                fn(err)
            })
    },
    hset: (key, field, value) => redisClient.hSet(key, field, value),
    expire: (key, seconds) => redisClient.expire(key, seconds),
}

module.exports = redisWrapper
