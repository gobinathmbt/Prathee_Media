let ENV = 'DEV'; //DEV,QA,LIVE,UAT
if (ENV == 'LOCAL') {
    module.exports.dbPort = "27017";
    module.exports.dbURL = "mongodb://127.0.0.1:27017/Test";
    module.exports.dbName = "Test";
} else if (ENV == 'DEV') {
    module.exports.dbPort = "27017";
    module.exports.dbURL = "mongodb+srv://gobinath:gobinath3@gobinath.xibawsy.mongodb.net/";
    module.exports.dbName = "TEST";
}
