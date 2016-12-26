var debug = require('debug')('api');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport, configAuth) => {
    // - **** GOOOGLE **************
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },(accessToken, refreshToken, profile, done)=>{

        process.nextTick(()=>{
            // Google authentication

            if (!req.user) {
                debug('GOOGLE user profile :', profile);   
                
            } else {
                debug("GOOGLE new User" , profile)
            }

        })
    }));


}

