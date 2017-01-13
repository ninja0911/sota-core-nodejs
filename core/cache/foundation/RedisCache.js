var BaseCache = require('./BaseCache');
var redis     = require('redis');
var logger    = require('log4js').getLogger('RedisCache');

'use strict';

var client = redis.createClient({
      host: process.env.REDIS_SERVER_ADDRESS,
      port: process.env.REDIS_SERVER_PORT,
    });

client.on('error', function(err) {
  logger.error('On redis error: ' + err);
});

class RedisCache extends BaseCache {

  set(key, value, meta, callback) {
    if (typeof meta === 'function') {
      callback = meta;
      meta = null;
    }

    client.set(key, value, callback);

    var ttl = Const.DEFAULT_CACHE_TTL;
    if (meta && meta.ttl) {
      ttl = meta.ttl;
    }
    client.expire(key, ~~(ttl/1000));
  }

  hmset(key, obj, meta, callback) {
    if (typeof meta === 'function') {
      callback = meta;
      meta = null;
    }

    var args = [key];
    for (let prop in obj) {
      let value = obj[prop];
      if (_.isNil(value)) {
        continue;
      }
      args.push(prop);
      args.push(value);
    }
    args.push(callback);
    client.hmset.apply(client, args);

    var ttl = Const.DEFAULT_CACHE_TTL;
    if (meta && meta.ttl) {
      ttl = meta.ttl;
    }
    client.expire(key, ~~(ttl/1000));
  }

  hgetall(key, callback) {
    client.hgetall(key, callback);
  }

  get(key, callback) {
    client.get(key, callback);
  }

  remove(key, callback) {
    client.del(key, callback);
  }

  removeSync(key) {
    client.del(key);
  }

}

module.exports = new RedisCache();
