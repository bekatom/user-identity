var debug = require('debug')('api');
var path = require('path');

var homePage = (req, res) => res.render(`${__dirname}/views/index`,{});
var apiPage = (req,res) => res.render(`${__dirname}/views/api`,{});


function userLogin(req, res) {

    res.render(`${__dirname}/views/login`,{
        message : req.flash('login message'),
        errors : req.flash('errors')
    });
}

function userLoginPost(req,res){

    debug("user post method , ", req.method);
    res.ok(200);
}

function userSignUp(req,res){

    res.render(`${__dirname}/views/signup`,{
        message : req.flash('signup message'),
        errors : req.flash('errors')
    })
}

function userLogout(req,res){
    req.logout();
    req.session.destroy(function(err) {
        res.redirect('/login');
    });
}


// Check it if user is logged in
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login')
    }
}

function userProfile(req,res){

    res.render(`${__dirname}/views/profile`, {
        message : req.flash('profile message '),
        user : req.user
    });
}

function generateToken(req,res){

    res.render(`${__dirname}/views/loginWithToken`,{
        message : req.flash('login message'),
        errors : req.flash('errors')
    });

}

module.exports = {
    apiPage,
    homePage,
    userProfile,
    generateToken,
    userLogin,
    userLogout,
    userLoginPost,
    userSignUp,
    isLoggedIn
};
