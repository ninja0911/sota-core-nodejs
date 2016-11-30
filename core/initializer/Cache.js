var path        = require('path');
var logger      = require('log4js').getLogger('Init.Cache');
var ExSession   = require('../../core/common/ExSession');

module.exports = function(app, CacheFactory, dirs) {
  _.each(dirs, function(dir) {
    logger.trace('Initializer::Cache dir=' + dir);
    if (!FileUtils.isDirectorySync(dir)) {
      throw new Error('Invalid cache directory: ' + dir);
    }

    var files = FileUtils.listFiles(dir, /.js$/i);
    if (!files.length) {
      logger.warn('Cache directory (' + dir + ') is empty');
      return;
    }

    _.forEach(files, function(file) {
      if (!FileUtils.isFileSync(file)) {
        throw new Error('Invalid cache file: ' + file);
      }

      var module = require(file);
      CacheFactory.register(path.basename(file, '.js'), module);
    });

  });

  // TODO: find a better way to cache and refresh masterdata version
  function refreshSettings() {
    CacheFactory.getDataVersion(function() {
      setTimeout(refreshSettings, 10000);
    });
  }

  setTimeout(refreshSettings, 1);
};