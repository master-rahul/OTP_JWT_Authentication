const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use('/', require('./routes/index'));

app.listen(8000, (error) => {
if(error) console.log("Error in starting express server");
console.log("Express Server running successfully on port 8000");
})