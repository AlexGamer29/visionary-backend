const redis = require('redis');
const { REDIS_URL } = require("../")
const redisClient = redis.createClient({
  url: REDIS_URL
});

redisClient.connect();

const redisWrapper = {
  connected: redisClient.isOpen,
  del: (keys) => { return redisClient.del(keys) },
  hgetall: (key, fn) => {
    redisClient.hGetAll(key)
      .then((resp) => {
        fn(null, resp);
      })
      .catch((err) => {
        fn(err);
      });
  },
  hset: (key, field, value) => { return redisClient.hSet(key, field, value) },
  expire: (key, seconds) => { return redisClient.expire(key, seconds) },
};

module.exports = redisWrapper;