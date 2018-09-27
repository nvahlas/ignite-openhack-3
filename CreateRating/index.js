var RatingDao = require('../models/RatingDao');
var DocumentDBClient = require('documentdb').DocumentClient;
const uuidv4 = require('uuid/v4');
var config = require('../config');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {
        await Promise.all( [getUser(req.body.userId), getProduct(req.body.productId), checkRating(req.body.rating)] ).then(
            function(exists) {
                var dal = new RatingDao(new DocumentDBClient(config.host, { masterKey: config.authKey }), config.databaseId, config.collectionId);
                dal.init(function () {
                    req.body.id = uuidv4();
                    req.body.timestamp = Date.now();
                    dal.addItem(req.body, function (data) {
                        context.res.body = 'All validation passed !';
                        console.log(data);
                        context.done();
                    });
                });

                return exists;
            },
            function(e) {
                context.res.body = 'Validation failed !';
                context.done();
                return false;
            } 
        );
    }


};

function checkRating(rating) {
    return new Promise(function(resolve, reject) {
        if (rating >= 0 && rating <= 5) {
            resolve(true);
        } else {
            reject();
        }
    });
};

function getProduct(productId) {
    const https = require('https');

    const options = {
        hostname: 'serverlessohproduct.trafficmanager.net',
        port: 443,
        path: "/api/GetProduct?productId="+productId,
        method: 'GET'
    };

    return new Promise(function(resolve, reject) {
        const req = https.request(options, (res) => {
            if (res.statusCode != 200) {
                reject();
            } else {
                resolve(true);
            }
        });

        req.on('error', (e) => {
            reject();
        });

        req.end();
    });
}

function getUser(userId) {
    const https = require('https');

    const options = {
        hostname: 'serverlessohuser.trafficmanager.net',
        port: 443,
        path: "/api/GetUser?userId="+userId,
        method: 'GET'
    };

    return new Promise(function(resolve, reject) {
        const req = https.request(options, (res) => {
            if (res.statusCode != 200 ) {
                reject();
            } else {
                resolve(true);
            }
        });

        req.on('error', (e) => {
            reject();
        });

        req.end();
    });
}