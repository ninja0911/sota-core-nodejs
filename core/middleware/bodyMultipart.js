
module.exports = function(app, config, options) {
  options = options || {
    keepExtensions: true,
    uploadDir: path.join(app.get('rootDir'), 'public/uploads'),
  };
  var multiparty = require('multiparty'),
      typeis = require('type-is'),
      qs = require('qs');

  return function(req, res, next) {
    // Ignore if the body has been processed
    if (req._body) {
      return next();
    }

    // Ignore GET request
    if (req.method.toUpperCase() === 'GET'|| req.method.toUpperCase() === 'HEAD') {
      return next();
    }

    // Has nothing to do if Content-Type is not multipart
    if (!typeis(req, 'multipart')) {
      return next();
    }

    req.body = req.body || {};
    req.files = req.files || {};

    // Set the flag is true to make it's compatible
    // with other middlewares in body-parser family
    req._body = true;

    var form = new multiparty.Form();
    Object.keys(options).forEach(function(key){
      form[key] = options[key];
    });

    form.parse(req, function(err, fields, files) {
      if (err) {
        next(err);
        return;
      }

      req.params = req.params || {};
      _.forEach(_.keys(fields), function(key) {
        req.body[key] = fields[key][0];
      });
      _.forEach(_.keys(files), function(key) {
        req.files[key] = files[key][0];
      });
      next();
    });
  }

};
