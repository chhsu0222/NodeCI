const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function() {
  console.log('IM ABOUT TO RUN A QUERY');
  // do not accidentally modify the object that is returned
  // from getQuery or we will modify the actual query itself
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  });

  console.log(key);

  return exec.apply(this, arguments);
};
