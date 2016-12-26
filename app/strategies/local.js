var debug = require('debug')('api');
var LocalStrategy = require('passport-local').Strategy;

// var models = require('../../../models');
// var LSCrypt = require('../../../helpers/crypt').LSCrypt;

var ip = require('ip');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

// var validators = require('../validators');

module.exports = (passport) => {

    /// ============================
    // local login without JWT
    // ===========================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },(req,email,password,done)=>{


        // sanam nebismieri sxva rame moxda mtavar tredshi es sheasrule
        process.nextTick(()=>{

             // STARTED TO AUTNETICATED WITH PASSPORT FOR SEQULIZER/MYSQL

             
        });
    }));


    
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },(req, email, password, done)=>{

        process.nextTick(()=>{

            // == Send Email =====
            // ===================
        })
    }));


}


