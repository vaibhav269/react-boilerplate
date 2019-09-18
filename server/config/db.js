const mongoose = require('mongoose');

module.exports = function(){
    const url = 'mongodb://localhost/billfree';
    mongoose.connect(url, 
        {useNewUrlParser:true,useUnifiedTopology: true}
    );
}