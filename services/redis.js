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



//   const cachedTasks = await redis.getAsync('tasks');

//   if (cachedTasks) {
//     const tasks = JSON.parse(cachedTasks);
//     console.log('Data is present in cache');
//     res.json(tasks);
//   } else {
//     const tasks = await Task.find();
//     await redis.setAsync('tasks', JSON.stringify(tasks));
//     console.log('Data is not present in cache');
//     res.json(tasks);
//   }