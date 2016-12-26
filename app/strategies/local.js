var debug = require('debug')('api');
var LocalStrategy = require('passport-local').Strategy;

var models = require('../../../models');
var LSCrypt = require('../../../helpers/crypt').LSCrypt;

var ip = require('ip');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var validators = require('../validators');

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

             models.users.findOne({
                 where : {
                   email : LSCrypt.getEmail(email)
                 },
                 raw : true
             }).then(user=>{

                 if(!user) {
                     debug('No user found')
                     return done(null, false, req.flash('errors', 'No user found.'));
                 }

                 // authenticate
                 models.users.findOne({
                     where : {
                         email: LSCrypt.getEmail(email),
                         password: LSCrypt.getPassword(password,user.salt)
                     },
                     raw : true
                 }).then(user =>{
                     if(!user) {
                         debug('Oops! Wrong password.')
                         return done(null, false, req.flash('errors', 'Oops! Wrong password.'));
                     }

                     debug('LOCAL USER :: ', user);
                     return done(null, user);

                 }).catch(err=>{
                     log.info(err);
                     debug('CATCH ERROR :::', err);
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


}


