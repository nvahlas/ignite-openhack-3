module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    if (req.body) {
        var payload = req.body;
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "UserId: " + payload.userId
        };
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};