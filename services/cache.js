const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  // do not accidentally modify the object that is returned
  // from getQuery or we will modify the actual query itself
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // See if we have a value for 'key' in redis
  const cacheValue = await client.get(key);

  // If we do, return that
  if (cacheValue) {
    console.log(cacheValue);
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);
  // notice that result is a mongoose document or model instance
  client.set(key, JSON.stringify(result));

  return result;
};
