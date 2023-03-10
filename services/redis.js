const redis = require('redis');

const client = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});
client.connect()
client.on("connect" , function(err) {
    console.log("redis connection done");
})
client.on('error', function (err) {
    console.log('Redis error: ' + err);
});

module.exports = client ;

