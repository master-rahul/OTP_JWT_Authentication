const emailValidator = require('email-validator');
const Authentication = require('../../model/authentication');
const Blocked = require('../../model/blocked');
const OTP = require('../../model/otp');
const jsonWebToken = require('jsonwebtoken');
module.exports.verify = async function(request, response){
    console.log(request.body);
    if (!request.body.email || request.body.email == undefined || request.body.email == null) return response.send(422, { "message": "Please send email Address in Body in JSON format where key being *email* " });
    else if (!request.body.otp || request.body.otp == undefined || request.body.otp == null) return response.send(422, { "message": "Please send OTP in Body in JSON format where key being *otp* " });
    else if (emailValidator.validate(request.body.email)){
        const user  = await Authentication.findOne({email : request.body.email});
        const blocked = await Blocked.findOne({ email: request.body.email });
        if(blocked){
            console.log('hello1');
            const remainingTime = Math.floor((3600 - (new Date() - blocked.updatedAt) / 1000));
            const message = `The email is blocked for ${remainingTime} seconds due to 5 invalid attempts`;
            response.status(400).json({ message });
        }
        else if(user){
            console.log('hello2');
            if(user.otp != request.body.otp){
                user.counter += 1;
                user.save();
                if(user.counter >= 5) {
                    const blocked = await Blocked.create({email : request.body.email});
                    return response.json("400", {"message" : "The email is blocked for 3600 seconds due to 5 invalid attempts"});
                } else return response.json("200", { "message": "The OTP not valid for this email address" });
            } else {
                console.log('hello3');
                const otp = await OTP.findOne({otp : request.body.otp});
                if(otp) return response.json(200, {"messgae" : "Please try new OTP, This OTP is already used"});
                const otpAdd = await OTP.create({otp : request.body.otp});
                const token = jsonWebToken.sign(request.body, 'secret', {expiresIn : 60 * 60});
                return response.json(200, {"message" : "Your token is generated", "token" : token});
            }
        }
        else {
            console.log('hello4');
            const blocked = await Blocked.findOne({email : request.body.email});
            if (blocked) {
                console.log('hello5');
                const remainingTime = Math.floor((3600 - (new Date() - blocked.updatedAt) / 1000));
                const message = `The email is blocked for ${remainingTime} seconds due to 5 invalid attempts`;
                response.status(400).json({ message });
            }
            else return response.json(200, {"message" : "Please generate the OTP for this email first"});
        }
    } else return response.json(422, { "message": "Email is Invalid, Please re-enter email address" });
  
}

module.exports.signIn = async function (request, response) {
    console.log("Request Body : ", request.body);
    if (!request.body.token || request.body.token == undefined || request.body.token == null) return response.send(422, { "message": "Please send Token in Body in JSON format where key being *token* " });
    else if (emailValidator.validate(request.body.email)) {
            jsonWebToken.verify(request.body.token, 'secret', function (err, decoded) {
                if(err) return response.json(200, {"message" : "The JsonWebToken is invalid"});
                else return response.json(200, {"message" : "The JsonWebToken is valid", "data" : decoded});
            });
    }else return response.json(422, { "message": "Email is Invalid, Please re-enter email address" });
}