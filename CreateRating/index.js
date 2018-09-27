module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    /*
    if (req.body) {
        await performRequest('/api/GetUser?userId=' + req.body.userId, context);
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    */

    if (req.body) {
        await Promise.all( [getUser(req.body.userId), getProduct(req.body.productId)] ).then(
            function(exists) {
                return exists;
            },
            function(e) {
                return false;;
            } 
        );
    }
};

function getProduct(productId) {
    const https = require('https');

    const options = {
        hostname: 'serverlessohuser.trafficmanager.net',
        port: 443,
        path: "/api/GetProduct?productId="+productId,
        method: 'GET'
    };

    return new Promise(function(resolve, reject) {
        const req = https.request(options, (res) => {
            res.on('data', (d) => {
                resolve(d?true:false);
            });
        });

        req.on('error', (e) => {
            reject(e);
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
            res.on('data', (d) => {
                resolve(d?true:false);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}