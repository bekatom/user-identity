var UserController = require('./index').UserController
var UserViews = require('./index').UserViews
var isLoggedIn = require('./index').isLoggedIn
var isAuthenticated = require('./index').isAuthenticated
// var models = require('../../models');
// var crudController  = require('../../core/crudController')(models.users);

module.exports = {

    '/' : { get: UserViews.homePage },
    '/api' : { get: UserViews.apiPage },


    '/login' : {
        get :  UserViews.userLogin,
        post : passport.authenticate('local-login',{
            successRedirect: '/profile/', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        })
    },
    '/signup' : {
        get : UserViews.userSignup,
        post : passport.authenticate('local-signup',{
            successRedirect: '/profile/', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        })
    },
     // authenticate with JWT POST method
    '/authenticate' : {
        post : UserController.user_authenticate,
        get : UserViews.userLogin

    },

    '/logout' : {
        get : UserViews.userLogout
    },

    '/profile' : {
        get : [isLoggedIn, UserViews.userProfile]
    },

    /////// ....... SOCIAL AUTH ROUTES .. ////////////////
    // **************************************************

    // ******   FACEBOOK AUTH 
    '/auth/facebook' : {
        get : passport.authenticate('facebook',{
            scope: 'email',
        })
    },
    '/auth/facebook/callback' : {
        get : passport.authenticate('facebook', {
            successRedirect: '/profile/', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
        })  
    },
    // ******   LINKEDIN AUTH
    '/auth/linkedin' : {
        get: passport.authenticate('linkedin', { 
            scope: ['r_basicprofile', 'r_emailaddress'] 
        })
    },
    '/auth/linkedin/callback' :{
        get: passport.authenticate('linkedin', {
            failureRedirect: '/signup',
            successRedirect: '/profile/' 
        })
    },

    // ******   GOOGLE
    '/auth/google' : {
        get: passport.authenticate('google')
    },
    '/auth/google/callback' :{
        get: passport.authenticate('google', {
            failureRedirect: '/signup',
            successRedirect: '/profile/' 
        })
    },

    /// ******  TWITTER authentication
    '/auth/twitter' : {
        get: passport.authenticate('twitter')
    },

    '/auth/twitter/callback' : {
        get: passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/signup'
        })
    },


    ////// ***********  END OF SOCIAL AuTHENTICATION ........
    ///// ***************************************************

    ///  API  ////////////////

    '/v1/users': {
        '/ping': {
            all: [isAuthenticated, UserController.ping]
        },
        '/count':{
            get : UserController.count
        },
        '/featured' : {
            get : UserController.featured_authors
        },
        '/get/:id' : {
            get : UserController.get_by_id
        },
        // CRUD
        '/list' : {
           // get : crudController.list
        },
        '/create' : {
          //  post : crudController.create
        },
        '/delete' : {
           // delete : crudController.delete
        },
        '/read' : {
           // get : crudController.read
        }

    }

}