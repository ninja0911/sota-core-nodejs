var crypto                = require('crypto');
var request               = require('request');
var google                = require('googleapis');
var SocialNetworkService  = require('./SocialNetworkService');
var plus                  = google.plus('v1');
var OAuth2                = google.auth.OAuth2;

module.exports = SocialNetworkService.extends({
  classname : 'GoogleService',

  getUserSocialModel: function() {
    return this.getModel('UserGoogleModel');
  },

  getUserDefFromInfo: function(info) {
    return {
      username: info.id,
      email: info.email || info.id,
      first_name: info.name ? info.name.givenName : info.displayName,
      last_name: info.name ? info.name.familyName : '',
      avatar_url: info.image ? info.image.url : null,
    };
  },

  _getGoogleInfo: function(accessToken, refreshToken, callback) {
    var oauth2Client = new OAuth2(
      process.env.GOOGLE_APP_ID,
      process.env.GOOGLE_APP_SECRET,
      process.env.APP_ENDPOINT
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    plus.people.get({
      userId: 'me',
      auth: oauth2Client
    }, function(err, info) {
      if (err) {
        return callback(err);
      }

      return callback(null, info);
    });
  },

  getUserByToken: function(accessToken, refreshToken, callback) {
    var self = this;
    async.waterfall([
      function info(next) {
        self._getGoogleInfo(accessToken, refreshToken, next);
      },
      function getUser(info, next) {
        return self.findOrCreateUserBySocialInfo(info, next);
      },
    ], callback);
  },

  linkUserByToken: function(userId, accessToken, refreshToken, callback) {
    var self = this;
    async.waterfall([
      function info(next) {
        self._getGoogleInfo(accessToken, refreshToken, next);
      },
      function tryToLinkUser(info, next) {
        return self.linkUserBySocialInfo(userId, info, next);
      }
    ], callback);
  },

});
