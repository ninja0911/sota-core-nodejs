var logger      = require('log4js').getLogger('Cache.removeEntity');

module.exports = function(model, id, callback) {
  var tableName = model.tableName;
  var keys = [];
  if (_.isArray(id)) {
    keys = _.map(id, function(i) {
      return util.format('entity-%s-%s', tableName, i);
    });
  } else {
    keys = [util.format('entity-%s-%s', tableName, id)];
  }

  logger.trace(util.format('Clear these keys from cache: %j', keys));

  RedisCache.remove(keys, callback);
};
