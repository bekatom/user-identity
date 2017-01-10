var debug = require('debug')('api');

var ip = require('ip');

var User = require('./models/users');

module.exports = function(passport){

    // configs for authentications
    var configAuth = require('./auth');

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, function (err, user) {
            // log.error(err); // log error
            done(err, user);
        });
    });

    require('./strategies/facebook')(passport, configAuth)
    require('./strategies/twitter')(passport, configAuth)
    require('./strategies/linkedin')(passport, configAuth)
    require('./strategies/local')(passport, configAuth)


};
