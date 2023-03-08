const mongoose = require('mongoose');
const moment = require('moment-timezone');
const validator = require('validator');


const TaskSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:true,
        default:false
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    createdAt:{
        type: Date,
        // required: true,
        default: Date.now
    },
    expireOn:{
        type:Date,
        // required:
        // default:Date.now
    }
},{
    // timestamps:true
})

// TaskSchema.virtual('createdAtIST').get(function() {
//     return moment.tz(this.createdAt, 'Asia/Kolkata');
//   });

TaskSchema.pre('save', function(next) {
    this.createdAt = moment.tz(this.createdAt, 'Asia/Kolkata').format();
    next();
  });

const Task = mongoose.model('Task' , TaskSchema)

module.exports = Task;
