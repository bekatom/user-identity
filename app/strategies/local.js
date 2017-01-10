var debug = require('debug')('api');
var LocalStrategy = require('passport-local').Strategy;

// var models = require('../../../models');
// var LSCrypt = require('../../../helpers/crypt').LSCrypt;

var ip = require('ip');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var User = require('../models/users')
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
            User.findOne({
                $or: [ 
                    { 'local.email': email},
                    { 'facebook.email': email},
                    { 'google.email': email}
                ]
            },(err, existingUser) => {

                if (err) {
                    return done(err)
                }

                if (existingUser) {
                    return done(null, false, req.flash('errors', 'That email is already taken.'))
                }

                if (req.user) {
                    var user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    user.save((err)=> {
                        if (err) {
                            throw err;
                        }
                        return done(null, user)
                    })
                } else {
                    var newUser = new User();
                     newUser.local.email = email;
                     newUser.local.password = newUser.generateHash(password);
                     newUser.avatar = 'noavatar.png';

                     newUser.save((err)=>{
                         if (err) {
                             throw(err)
                         }
                         return done(null, user)   

                     })
                }

            })
            

        })
    }));


}


