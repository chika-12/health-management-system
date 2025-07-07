const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 500 });
module.exports = cache;
