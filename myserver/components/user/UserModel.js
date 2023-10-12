const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: { type: ObjectId },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    address:{type: String},
    phoneNumber:{type:Number},
    role:{type: Number,default:1},
    //1:user,100:adim,1000:system
    //1,2
    //or xor and not
});

module.exports =mongoose.models.user || mongoose.model('user', userSchema);