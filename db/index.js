const MongoClient = require('mongodb').MongoClient;

exports.getDbReference = async () => {
    try {
        return await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
    } catch (error) {
        return null;
    }
}