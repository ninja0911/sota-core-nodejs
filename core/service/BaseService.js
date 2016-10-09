var BaseClass   = require('../common/BaseClass');

module.exports = BaseClass.extend({
  classname : 'BaseService',

  initialize : function(exSession) {
    logger.info('BaseService<' + this.classname + '>::initialize');
    this._exSession = exSession;
  },

  getModel : function(classname) {
    return this._exSession.getModel(classname);
  },

  getService : function(classname) {
    return this._exSession.getService(classname);
  },

  destroy : function() {
    delete this._exSession;
  },

});
