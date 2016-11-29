module.exports = {

    'facebookAuth': {
        //TODO pass configs regard env process
        // Here is Lucstock PRODUCTION  CONFIGS
        // 'clientID': '393052960717435', // your App ID
        //'clientSecret': 'aad1c660fbaae32a761b0049e4df43b5', // your App Secret
        //'callbackURL': 'http://dev.luckstock.com/user/auth/facebook/callback'

        //   MY TEST CONFIGS 
        'clientID': '636874353153329', // your App ID
        'clientSecret': '6880e52fb3bba3a20b7c5ff6e5d3ca18', // your App Secret
        'callbackURL': 'http://localhost:4000/auth/facebook/callback'

    },

    'twitterAuth': {
        'consumerKey': '5f2TMZOhKlnyPe6dPNiDAaHLa',
        'consumerSecret': '5yKlordKk1NOGKXUaR20YtLIye4Xni2JgsMpxqeoHwgmEj7b7h',
        'callbackURL': 'http://localhost:4000/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:4000/auth/google/callback'
    },

    'linkedinAuth': {
        'clientID': '8648tk5nmauuyr',
        'clientSecret': '4vmJLl94c1xX23UB',
        'callbackURL': 'http://localhost:4000/auth/linkedin/callback'
    },

};