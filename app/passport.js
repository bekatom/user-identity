var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var debug = require('debug')('api');
var models = require('../../models');
var LSCrypt = require('../../helpers/crypt').LSCrypt;

var ip = require('ip');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var validators = require('./validators');

module.exports = function(passport){

    // configs for authentications
    var configAuth = require('./auth');

    passport.serializeUser((user,done)=>{
        debug("serializeUser User ", user);
        done(null, user.user_id);
    });

    passport.deserializeUser((user_id,done)=>{

       models.users.findOne({
           where : {
               user_id : user_id
           },
           raw : true
       }).then(user=>{

           //debug("after deserilize : ", user);
           done(null, user);
       });

    });

    passport.use('token-login', (req,done) =>{
        console.log("token-login :::: ");
        process.nextTick(()=>{

            console.log("Req body ", req.body);
            return done(null, false, req.flash('errors', 'No user found.'));

        });

    });


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

             models.users.findOne({
                 where : {
                   email : LSCrypt.getEmail(email)
                 },
                 raw : true
             }).then(user=>{

                 if(!user)
                     return done(null, false, req.flash('errors', 'No user found.'));

                 // authenticate
                 models.users.findOne({
                     where : {
                         email: LSCrypt.getEmail(email),
                         password: LSCrypt.getPassword(password,user.salt)
                     },
                     raw : true
                 }).then(user =>{
                     if(!user)
                         return done(null, false, req.flash('errors', 'Oops! Wrong password.'));

                     return done(null, user);

                 }).catch(err=>{
                     log.info(err);
                     return done(null, false, req.flash('errors', err));
                 });


             }).catch(err=>{
                 log.info(err);
                 // if there are any errors, return the error
                 return done(null, false, req.flash('errors', err));
                 //return done(err);
             })

        });
    }));


    /// ============================
    /// local signup
    /// ============================
    /**
     * @rules
     * username - required, unique, min:5, regex Checked, keyword Checked
     * password - required, min:4, hashed
     * email - required, unique, hashed
     * firstname - required, kewyord checked
     * lastname - required, kewyord checked
     * firm name - String | null
     * register_datetime - now (format?)
     * register_platform - null
     * register_ip - IP address of server
     * status - "waiting" (for activation maybe)
     * groups - array
     * activate_key ?
     * referal_id ?
     * referral_host ?
     * geoip_ser - IP based location of user?
     * social - false?
     */
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },(req, email, password, done)=>{

        process.nextTick(()=>{

            const data = req.body;
            // const validators = validators;

            // validate input
            switch(false){
                case validators.email(data.email):
                    return done(null, false, req.flash('errors', validators.errors.email))
                case validators.password(data.password):
                    return done(null, false, req.flash('errors', validators.errors.password))
                case validators.username(data.username):
                    return done(null, false, req.flash('errors', validators.errors.username))
                case validators.firstname(data.firstname):
                    return done(null, false, req.flash('errors', validators.errors.firstname))
                case validators.lastname(data.lastname):
                    return done(null, false, req.flash('errors', validators.errors.lastname))
            }

            // Process and generate input
            let salt = LSCrypt.getRandomSalt(),
                email = LSCrypt.getEmail(data.email),
                password = LSCrypt.getPassword(email,salt),
                username = data.username.trim(),
                status = "waiting",
                groups = data.groups | []
                // activateKey = LSCrypt.getActivateKey() // TODO::


            let checkUsername = models.users.findOne({
                where : {
                    username : username
                }
            })

            let checkEmail = models.users.findOne({
                where : {
                    email : email
                },
                raw : true
            })

            const checkUniqueness = async(() => {
                if(await(checkEmail))
                    return done(null, false, req.flash('errors', 'That email is already taken.'))


                if(await(checkUsername))
                    return done(null, false, req.flash('errors', 'That username is already taken.'))

                let user = {
                    email,
                    username,
                    password,
                    salt,
                    status,
                    groups,
                    firstname : data.firstname.trim(),
                    lastname : data.lastname.trim(),
                    firmname : data.firmname ? data.firmname.trim() : null,
                    register_datetime : new Date(),
                    register_platform : null,
                    register_ip : ip.address(),
                    activate_key : null, //TODO::
                    referal_id : null,
                    referral_host : null,
                    geoip_ser : null,
                    social : false
                }

                models.users.create(user)
                    .then(function (err, res) {
                        if(err) log.info(err)
                        debug(res)
                    })

                debug("new User" , user)
            })

            checkUniqueness()
                .catch(function (err) {
                    // log.info(err)
                    debug(err)
                })

            debug("debug : ", { salt , email, password})

            // == Send Email =====
            // ===================
        })
    }));

    //- ================== SOCIAL AUTHENTICCATIONS ========================

    // - ***** FACEBOOK *******
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        profileFields: ['id', 'emails', 'name'] // what fields we need from facebook
    },(req , accessToken, refreshToken, profile, done)=>{
        
        process.nextTick(()=>{

            // check if user exists in request (if user us already authenticated)
            if (!req.user) {
                debug('user profile :', profile);   
                // Process and generate input
                // let salt = LSCrypt.getRandomSalt(),
                //     email = LSCrypt.getEmail(profile._json.email),
                //     password = LSCrypt.getPassword(email,salt),
                //     username = data.username.trim(),
                //     status = "waiting",
                //     groups = data.groups | []

                //     // Construct new User
                //     let user  = {
                //        email = LSCrypt.getEmail(profile._json.email),
                //        password = LSCrypt.getPassword(email,salt),
                //        username = data.username.trim(),
                //        status = "waiting",
                //        groups = data.groups | [] 
                //     }    


            } else {
                debug("new User" , profile)
            }
            // debug('profile: ', profile._json);
            // let user = profile._json;
            // user.user_id = user.id; 
            // debug('user :', user);
            // return done(null, user);
            // // return cb(null, null);
       })
    }));

    // - **** TWITTER  ***********
    /// To access email need to enter Privacy Policy URL, & Terms of Service URL at 
    // https://apps.twitter.com at your application
    passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        email: true,

    },(req, token, tokenSecret, profile, done)=>{

        process.nextTick(()=>{
             let user = {};            
             // check if user exists in request (if user us already authenticated)
             if (!req.user) {
                 debug('user not exists yet : ', profile);
                 // TODO Here we need to create user & serialize the user for the session
                 done(null, user);  
             } else {
                 debug('user exists')
                 done(null, user )
             }

        })
    }));

    // - **** GOOOGLE **************
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },(accessToken, refreshToken, profile, done)=>{

        process.nextTick(()=>{
            // Google authentication
        })
    }));


    passport.use(new LinkedInStrategy({
        consumerKey: configAuth.linkedinAuth.clientID,
        consumerSecret: configAuth.linkedinAuth.clientSecret,
        callbackURL: configAuth.linkedinAuth.callbackURL,
        
    },  (token, tokenSecret, profile, done)=> {
        process.nextTick(() => {
            // linkedint authentication
        });
    }));

};
