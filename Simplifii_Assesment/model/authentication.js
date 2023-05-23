const mongoose = require("mongoose");
const authenticationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp : {
        type : Number,
        required : true,
        unique : true
    },
    counter : {
        type : Number,
        required : true
    }
}, { timestamps: true });

authenticationSchema.index({createdAt : 1}, {expireAfterSeconds : 300});

const Authentication = mongoose.model('Authentication', authenticationSchema);
module.exports = Authentication;