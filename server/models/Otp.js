const mongoose = require('mongoose');
const { Schema } = mongoose;
var md5 = require('md5');
const AutoIncrement = require('mongoose-sequence')(mongoose); //To add auto incrementing field to schemas

const otpSchema = new Schema({

    user_id:{ type: String, trim: true },
    user_email: { type: String, trim: true },
    user_phone:{ type: String, trim: true },
    otp:{ type: String,required:true, trim: true },
    token:{ type: String,required:true, trim: true },
    purpose: { type: String,trim: true },
    data:{},
    otp_type:{type:String,enum:["phone","email"]},
    is_verified:{type:Boolean,default:false},
    attempt_count:{ type: Number,required:true, trim: true,default:0 },
    expiry_time:{type:Date},
    date_added:{ type: Date, trim: true,default:new Date() },
    date_updated:{ type: Date, trim: true,default:new Date() },
    status:{type:String,enum:["a","i"],default:'a'}
});

otpSchema.methods.generateHash = function (password) {
    return md5(password);
};

// checking if password is valid
otpSchema.methods.validatePassword = function (password) {
    if (md5(password) === this.password) {
        return true;
    }
    else {
        return false;
    }
};

otpSchema.plugin(AutoIncrement, { inc_field: 'id',id:'3'  });
module.exports = mongoose.model('Otp', otpSchema);