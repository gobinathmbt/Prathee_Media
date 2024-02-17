module.exports.ServerPort = 8083;
let ENV = 'DEV';

module.exports.base_url = '';
if (ENV == 'UAT') {
    module.exports.base_url = '';
} else if (ENV == 'PROD') {
    module.exports.base_url = '';
}