var debug = require('debug')('api');
var TwitterStrategy = require('passport-twitter').Strategy;


module.exports = (passport, configAuth) => {

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



}
