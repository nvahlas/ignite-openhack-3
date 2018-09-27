module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {
        await performRequest('/api/GetUser?userId=' + req.body.userId, context);
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

function performRequest(endpoint, context) {
    const https = require('https');

    const options = {
        hostname: 'serverlessohuser.trafficmanager.net',
        port: 443,
        path: endpoint,
        method: 'GET'
    };

    return new Promise(resolve => {

        const req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                if (res.statusCode == 200) {
                    console.log("success");
                    context.res = {
                        body: JSON.parse(d)
                    }
                } else {
                    console.log("error");
                    context.res = {
                        body: "No user found"
                    }
                }
                context.done();
            });
        });

        req.on('error', (e) => {
            error();
        });
        req.end();
    });
}