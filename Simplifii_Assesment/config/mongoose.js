const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/simplifii_assesment');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in connecting Database"));
db.once('open', () => {console.log('Connected to MongoDB successfully')});
module.exports = db;
