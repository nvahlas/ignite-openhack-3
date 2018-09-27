module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.productId) {
        var productId = req.query.productId;
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "The product name for your product id " + productId + " is Starfruit Explosion",
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};