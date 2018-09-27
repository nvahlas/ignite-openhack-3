var config = {}

config.host = process.env.HOST || "https://h3rating.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "kOKILxstRhMlG3kXSSxZkUEHRikmphuwbRwkXBnmXf9x4Klptekzm3igWgPY1Fe2YkSa0RZHOSPZng7l5bFEWw==";
config.databaseId = "Ratings";
config.collectionId = "Ratings";

module.exports = config;