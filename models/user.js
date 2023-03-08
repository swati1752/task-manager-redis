const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') 
require ('dotenv').config()
const Task = require('./task');
const { Timestamp } = require('mongodb');

const UserSchema = new mongoose.Schema( {
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot be password itself')
            }
        }
    },
    age: {
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('Age not valid')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    },
}, {
    timestamps:true
})


UserSchema.virtual('tasks' , {
    ref:'Task',
    localField:'_id',
    foreignField:'owner'    
})

// passing necessary data to sever
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;
    // delete userObject.avatar;

    return userObject;
}

// process.env.JWT_SECRET

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN)
    // console.log(token);
    user.tokens = user.tokens.concat({ token:token })

    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async function(email, password)  {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to login")
    }
    return user;
}

UserSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

UserSchema.pre('remove' , async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})


const User = mongoose.model('User' , UserSchema);

module.exports = User;