const mongoose = require('mongoose');
const validator = require('validator');
if (process.env.NODE_ENV !== 'production') 
require ('dotenv').config()
 


mongoose.connect( process.env.MONGO_URL ,
 {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then((db)=>{
    console.log('mongod done');
})
.catch((e)=>{
    console.log('database error');
})
