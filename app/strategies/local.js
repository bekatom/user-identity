var debug = require('debug')('api');
var LocalStrategy = require('passport-local').Strategy;

var ip = require('ip');
var User = require('../models/users')


module.exports = (passport) => {

    /// ============================
    // local login without JWT
    // ===========================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },(req,email,password,done)=>{
        process.nextTick(()=>{
           
            process.nextTick(function () {
                User.findOne({
                    'local.email': email
                }, function (err, user) {
                    // log.error(err, req); // log error
                    // if there are any errors, return the error
                    if (err) {
                        return done(err);
                    }

                    // if no user is found, return the message
                    if (!user) {
                        return done(null, false, req.flash('errors', 'No user found.'));
                    }

                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('errors', 'Oops! Wrong password.'));
                    }

                    // all is well, return user
                    else {
                        return done(null, user);
                    }
                });
            });

        });
    }));


    
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },(req, email, password, done)=>{

        process.nextTick(()=>{

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
                         return done(null, newUser)   

                     })
                }

            })
            

        })
    }));


}


