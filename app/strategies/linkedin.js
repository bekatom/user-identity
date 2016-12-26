var debug = require('debug')('api');
var LinkedInStrategy = require('passport-linkedin').Strategy;

module.exports = (passport, configAuth) => {

     passport.use(new LinkedInStrategy({
        consumerKey: configAuth.linkedinAuth.clientID,
        consumerSecret: configAuth.linkedinAuth.clientSecret,
        callbackURL: configAuth.linkedinAuth.callbackURL,
        
    },  (token, tokenSecret, profile, done)=> {
        process.nextTick(() => {
            // linkedint authentication

            if (!req.user) {
                debug('LINKEDIN user profile :', profile);   
                
            } else {
                debug("LINKEDIN new User" , profile)
            }
        });
    }));

}