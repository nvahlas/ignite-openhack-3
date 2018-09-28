var RatingDao = require('../models/RatingDao');
var DocumentDBClient = require('documentdb').DocumentClient;
const uuidv4 = require('uuid/v4');
var config = require('../config');

let request = require('async-request');

var dao = new RatingDao(new DocumentDBClient(config.host, { masterKey: config.authKey }), config.databaseId, config.collectionId);


async function productExists(productId) {
    let response = await request('https://serverlessohproduct.trafficmanager.net/api/GetProduct?productId='+productId);
    return (response.statusCode!=200?false:true);
};

async function userExists(userId) {
    let response = await request('https://serverlessohuser.trafficmanager.net/api/GetUser?userId='+userId);
    return (response.statusCode!=200?false:true);
};

function ratingOk(rating) {
    return (rating >= 0 && rating <= 5);
}

module.exports = async function (context, req) {
    if (req.body) { 
        if (   await productExists(req.body.productId) 
            && await userExists(req.body.userId)
            && ratingOk(req.body.rating)) {

            context.log('Validation Ok !');
            
        } else { 
            context.log('Validation failed !');
        }
        
        /*    
        await Promise.all( [getUser(req.body.userId), getProduct(req.body.productId), checkRating(req.body.rating)] )
            .then( function (valid) {
                daoInit(dao).then(function(initialized) {
                    daoAddItem(dao, req.body).then(
                        function(data) {
                            context.res.body = data;
                            context.done();
                        })
                    })
                },
                function(e) {
                    context.res.body = 'Validation failed !';
                    context.done();
                }
            )
        */
    }
};

async function daoInit(dao) {
    return new Promise(function(resolve, reject) {
        dao.init(function (err) {
            if (err) {
                console.log('init failed !')
                reject(err);
            } else {
                console.log('init done !');
                resolve(true);
            }
        });
    });
};

async function daoAddItem(dao, item) {
    return new Promise(function(resolve, reject) {
        item.id = uuidv4();
        item.timestamp = Date.now();
        
        console.log('item created !', item);
        resolve(item);
        /*
        dao.addItem(item, function (err, data) {
            if (err) {
                console.log('could no tcreate item !', err);
                reject(err);
            } else {
                console.log('item created !', data);
                resolve(data);
            }
        });
        */
    });
}