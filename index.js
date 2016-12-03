/**
 * Created by beka on 4/22/16.
 */
var debug = require('debug')('api');
var path = require('path');


module.exports = function (app) {

    //register responses
    require('./responses/index').forEach(function (response) {
        app.use(response);
    });


    var apps = [

         'categories',
         'main',
         'users',
         'items',
         'pages',
         'memcached',
         'withdraw',
         'datahub',
         'payout'
    ];

    apps.forEach(function (application) {

        debug("Importing app : ", application);
        app.map(require('./apps/' + application + '/routes.js'));
        //passport.map(require('./apps/' + application + '/routes.js'));
        debug("Importing end app : ", application);

    });


    // catch 404
    app.use(function (req, res) {

        res.notFound();
    });

    // catch 5xx
    app.use(function (err, req, res, next) {
        console.log(err);
        debug(err);
        res.serverError();
    });


};
