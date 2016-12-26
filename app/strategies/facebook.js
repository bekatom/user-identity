var debug = require('debug')('api');
var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = (passport, configAuth) => {

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
                debug('FACEBOOK user profile :', profile);   
                return done(null, profile);

            } else {
                debug("FACEBOOK need to create -> new User" , profile)
                return done(null, profile);
            }
           
       })
    }));

}
