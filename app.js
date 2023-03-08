const express = require('express');
require('./db/mongoose')
require('./services/redis')
const UserR = require('./routers/user');
const TaskR = require('./routers/task');
if (process.env.NODE_ENV !== 'production') 
require ('dotenv').config()
const app = express()

const port = process.env.PORT



app.use(express.json())
app.use(UserR)
app.use(TaskR)

// const redis = require('redis');
// const client = redis.createClient({
//     host: '127.0.0.1',
//     port: '6379'
// });



app.listen( port , ()=>{
    console.log(`Server running at port ${port}`);
})


