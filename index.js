module.exports = {
    UserController: require('./userController.v1.js'),
    UserStore: require('./userController.v1').UserStore,
    UserViews: require('./userViews'),
    isLoggedIn: require('./userViews').isLoggedIn, // this is to check if session exist
    isAuthenticated: require('./userController.v1').isAuthenticated // this is to check if tocken exists
};