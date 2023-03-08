const mongoose = require('mongoose');
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
