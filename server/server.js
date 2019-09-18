const express = require('express');
const bodyParser = require('body-parser');

const configDb = require('./config/db.js');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

configDb(); //setting up the connection with mongoose

require('./routes/login')(app);
require('./routes/signup')(app);
require('./routes/verify-otp')(app);


app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});