const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); //To add auto incrementing field to schemas

const userSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required:true
    },
    token: {
        type: String,
        required:true
    },
    date_added: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

userSessionSchema.plugin(AutoIncrement, { inc_field: 'id',id:'1' });
module.exports = mongoose.model('UserSession', userSessionSchema);
