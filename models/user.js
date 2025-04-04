const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    age:{
        type: Number,
        required:true
    },
    mobile:{
        type:String
    },
    address:{
        type: String,
        required:true
    },
    aadharcardnumber:{
        type: Number,
        required:true,
        unique: true
    }
    ,
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['voter','admin'],
        default:'voter'
    },
    isvoted:{
        type: Boolean,
        default:false
    }
});

userSchema.pre('save',async function(next){
    const person = this;
    if(! person.isModified('password')) return next();
        try {
            const salt = await bcrypt.genSalt(10);
     
            // hash password 
            const  hashedPassword = await bcrypt.hash(person.password,salt);
       person.password = hashedPassword;
       next();
        } catch (error) {
            return next(error);
        }
    })
    
    userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch  = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }    
    }

const User = mongoose.model('user',userSchema);
module.exports = User;