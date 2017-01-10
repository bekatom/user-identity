//var LocalStrategy = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
// var LinkedInStrategy = require('passport-linkedin').Strategy;

//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var debug = require('debug')('api');

// var models = require('../../models');
// var LSCrypt = require('../../helpers/crypt').LSCrypt;

var ip = require('ip');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var User = require('./models/users');
// var validators = require('./validators');

module.exports = function(passport){

    // configs for authentications
    var configAuth = require('./auth');

    passport.serializeUser((user,done)=>{
        debug("serializeUser User ", user);
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, function (err, user) {
            // log.error(err); // log error
            done(err, user);
        });
    //    models.users.findOne({
    //        where : {
    //            user_id : user_id
    //        },
    //        raw : true
    //    }).then(user=>{

    //        //debug("after deserilize : ", user);
    //        done(null, user);
    //    });

    });

    require('./strategies/facebook')(passport, configAuth)
    require('./strategies/twitter')(passport, configAuth)
    require('./strategies/linkedin')(passport, configAuth)
    require('./strategies/local')(passport, configAuth)


};
