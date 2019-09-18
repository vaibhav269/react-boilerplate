const mongoose = require('mongoose');
const { Schema } = mongoose;
var md5 = require('md5');
const AutoIncrement = require('mongoose-sequence')(mongoose); //To add auto incrementing field to schemas

const userSchema = new Schema({
    user_fname: { type: String,required:true, trim: true },
    user_lname: { type: String,required:true, trim: true },
    user_email: { type: String,required:true, trim: true },
    username: { type: String,required:true, trim: true },
    password: { type: String,required:true, trim: true },
    user_phone: { type: String,required:true, trim: true },

    user_summary: { type: String, trim: true },
    user_profile_image: { type: String, trim: true },
    user_last_login: { type: Date, trim: true },
    admin_access: [{ type: String }],
    feature_access: [{ type: String }],
    gen_bill_access: [{ type: String }],
    gen_bill_dyn_fields: [{ type: String }],
    user_email_verified: { type: String, enum: ['y', 'n', 'e', 'c'],default:'n'},
    user_phone_verified: {type:Boolean,default:false},
    is_merchant: {type:Boolean,default:false},
    allow_merchant_app: {type:Boolean,default:false},
    date_added: { type: Date, trim: true },
    date_updated: { type: Date, trim: true,default:new Date() },
    added_by: { type: String, trim: true },
    updated_by: { type: String, trim: true },
    is_deleted: Boolean,
    status: { type: String, enum: ['a', 'i'],default:'i'},
    bulk_csv_file: { type: String, trim: true },
    is_active: {type:Boolean,default:true}
});

userSchema.methods.generateHash = function (password) {
    return md5(password);
};

// checking if password is valid
userSchema.methods.validatePassword = function (password) {
    if (md5(password) === this.password) {
        return true;
    }
    else {
        return false;
    }
};

userSchema.plugin(AutoIncrement, { inc_field: 'id',id:'2'  });
module.exports = mongoose.model('User', userSchema);