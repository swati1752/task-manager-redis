const redis = require('redis');
require ('dotenv').config()

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});
client.connect()
client.on("connect" , function(err) {
    console.log("redis connection done");
})
client.on('error', function (err) {
    console.log('Redis error: ' + err);
});

module.exports = client ;

