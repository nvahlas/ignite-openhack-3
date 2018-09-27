var RatingDao = require('../models/RatingDao');
var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('../config');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var ratingId = req.query.ratingId
    if (!ratingId) {
        context.res.statusCode = 400;
        context.res.body = 'Validation failed !';
        return false;
    }

    await new Promise(function () {
        var dal = new RatingDao(new DocumentDBClient(config.host, { masterKey: config.authKey }), config.databaseId, config.collectionId);
        dal.init(function () {
            dal.getItem(ratingId, function (error, data) {
                if (!data) {
                    context.res.statusCode = 400;
                    context.res.body = 'No rating found ! ' + error;
                } else {
                    context.res.body = data;
                }
                console.log(context.res.body);
                context.done();
            });
        });
    });
};