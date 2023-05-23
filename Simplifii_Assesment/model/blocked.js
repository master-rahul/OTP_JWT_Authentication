const mongoose = require("mongoose");
const blockedSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
}, {timestamps : true});

const Blocked = mongoose.model('Blocked', blockedSchema);
module.exports = Blocked;