module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {
        performRequest('/api/GetUser?userId=' + req.body.userId, function(data) {
            console.log(data);
            context.res = {
                body: data
            };    
        }, function() {
            context.res = {
                body: "User " + req.body.userId + " does not exist"
            };
        });
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};


function performRequest(endpoint, success, error) {
    const https = require('https');

    const options = {
      hostname: 'serverlessohuser.trafficmanager.net',
      port: 443,
      path: endpoint,
      method: 'GET'
    };
    
    
    const req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
    
      res.on('data', (d) => {
        success(JSON.parse(d));
      });
    });
    
    req.on('error', (e) => {
        error();
    });
    req.end();
}