var express = require('express');
var isAuthenticated = express.Router();

var async = require('async');
var debug = require('debug')('api');
var jwt = require('jsonwebtoken');

// var models = require('../../models');
// var Memcached = require('../memcached');
// var memCachedKeys = Memcached.memCachedKeys;

// var LSCrypt = require('../../helpers/crypt').LSCrypt;
// var util = require('../../helpers/util');

const JWT_SECRET_KEY = "JWTluckstocksecretkey!!!$$$";

var UserStore = {

    _columns: ['user_id', 'username', 'firstname', 'lastname', 'avatar',
        'homeimage', 'profile_title', 'profile_desc', 'badges'],

    by_id: user_id=>{

        return new Promise((resolve, reject)=>{

            // models.users.findOne({

            //     where: {
            //         user_id: user_id
            //     },
            //     raw : true
            // }).then(result =>{
            //     // TODO: Echo result only if API authorisation passed
            //     resolve(result);
            // })

        })


    },

    featured_authors: ()=> {


        return new Promise((resolve, reject)=>{

            // Memcached.controller.get_cached(memCachedKeys["featured_authors"].key).then(data=>{
            //     resolve(data);

            // }).catch(err=>{

            //     models.users.findAll({
            //         attributes: UserStore._columns,
            //         where: {
            //             status: "activate",
            //             featured_author: "true"
            //         }, order: [["user_id", "ASC"]]
            //         , offset: 0, limit: 4,
            //         raw : true
            //     }).then(result=>{

            //         Memcached.controller.set_cached_data(memCachedKeys["featured_authors"].key,
            //             result,
            //             memCachedKeys["featured_authors"].time
            //         );
            //         resolve(result);

            //     })

            // });

        });
    },

    count: ()=>{

        return new Promise((resolve,reject)=>{
            // Memcached.controller.get_cached(memCachedKeys["users_count"].key).then(data=>{
            //     resolve(data);
            // }).catch(e=>{

            //     models.users.count({
            //         where: {
            //             $or: [
            //                 { status: "activate" }, { status: "waiting" }
            //             ]
            //         }
            //     }).then(data=>{

            //         Memcached.controller.set_cached_data(memCachedKeys["users_count"].key,
            //             data,
            //             memCachedKeys["users_count"].time
            //         );
            //         resolve(data);
            //     })

            // });

        })

    }
};


// TOKENT autneticate

user_authenticate = (req, res)=>{
    //debug("user authenticate :", req.body);
    models.users.findOne({
        where : {
            email : LSCrypt.getEmail(req.body.email)
        },
        raw : true
    }).then(user=>{

        if(!user)
            res.ok({success: false, message: 'Authentication failed. User not found.' })
        debug("user authenticate :", user);
        // authenticate
        // models.users.findOne({
        //     where : {
        //         email: LSCrypt.getEmail(req.body.email),
        //         password: LSCrypt.getPassword(req.body.password,user.salt)
        //     },
        //     raw : true
        // }).then(user =>{
        //     if(!user)
        //         res.ok({success: false, message: 'Oops! Wrong password.' });

        //     //TODO secret key from app config
        //     var token = jwt.sign(user, JWT_SECRET_KEY , {
        //         expiresInMinutes: 1440 // expires in 24 hours
        //     });

        //     //return done(null, user);
        //     res.ok({success : true,message : 'Enjoy your token', token : token})

        // }).catch(err=>{
        //     log.info(err);
        //     res.badRequest({success: false, message: 'Oops Somethis goes wrong!!!.' });
        // });


    }).catch(err=>{
        log.info(err);
        // if there are any errors, return the error
        res.badRequest({success: false, message: 'Oops Somethis goes wrong on root method!!!.' });
        //return done(err);
    })



};

isAuthenticated.use((req,res,next) =>{
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        // verifies secret and checks exp
        jwt.verify(token, JWT_SECRET_KEY, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.forbidden({
            success: false,
            message: 'No token provided.'
        });
    }

});

update_payout = (req, res)=>{

    var payout = parseFloat(req.body.payout),
        user_id = parseInt(req.body.user_id),
        withdraw_id = parseInt(req.body.withdraw_id),
        country_code = req.body.country_code,
        irs_withholding = parseFloat(req.body.irs_withholding);

    ///TODO if we are using Promises (Prmises are native now in node.js )
    ///TODO we need to remove async waterfall
    async.waterfall([
        function (done) {
            // get user info and walidate total field ß
            var where = { where: { user_id: user_id } };

            // models.users.findOne(where).then(data=>{


            //     if (payout > data.dataValues.total)
            //         done(true, "Payout is > total !!! ");
            //     else {
            //         done(null, data)
            //     }


            // }).catch(err=>{

            //     log.info(err,req);
            //     done(true, "User not found , or strange query!")
            // })

        }, // update user info
        function (data, done) {

            var user = data;

            var values = { total: user.total - payout };
            var where = { where: { user_id: user.user_id } };
            // models.users.update(values, where).then(data=>{
            //     done(null, data);
            // }).catch(err=>{
            //     // error true
            //     log.info({err,req});
            //     done(true, "Exception in update user , or strange query!")
            // })

        }, // update withdraw table
        function (data, done) {

            var values = { paid: "true", paid_datetime: new Date() },
                where = { where: { id: withdraw_id } };

            // models.withdraw.update(values, where).then(data=>{
            //     done(null, data);
            // }).catch(err=>{
            //     // error true
            //     log.info({err,req});
            //     done(true, err);
            // })
        },
        // Create user_tax state
        function (data, done) {

            // console.log("create user tax table ");

            var obj = {
                withdraw_id: withdraw_id,
                country_code: country_code,
                irs_withholding: irs_withholding,
                user_id: user_id
            };

            // models.users_tax.create(obj).then(data=>{
            //     done(null, data)
            // }).catch(err=>{

            //     log.info(err,req);
            //     done(true, err)
            // })

        }

    ], // WATERFALL ERROR HANDLING
        function (err, result) {

            /// TODO srange warning when data is not valid and happens some error
            //  https://github.com/sequelize/sequelize/issues/4883
            //  Sequelize::sync causes warning: "a promise was created
            //  in a handler but was not returned from it" #4883

            result = { err: err, message: result };
            if (err)
                res.badRequest(result);
            else
                res.ok({ success: 1 });

        })


};





module.exports = {
    ping: (req,res)=>{res.ok(null, null, 'API server for user is working')},

    count: (req,res)=>{

        UserStore.count().then(data=>{
            res.ok(data);
        })

    },
    featured_authors: (req,res)=>{

        UserStore.featured_authors().then(data=>{
            res.ok(data);
        })

    },
    by_id: (req,res)=>{

        UserStore.by_id(req.params.id).then(data=>{
            res.ok(data);
        })
    },
    update_payout: update_payout,
    user_authenticate:user_authenticate,
    isAuthenticated : isAuthenticated,
    UserStore: UserStore
};
