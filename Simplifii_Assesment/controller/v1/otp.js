const emailValidator = require('email-validator');
const Blocked = require('../../model/blocked'); 
const Authentication  = require('../../model/authentication');
const OTP = require('../../model/otp');
module.exports.generate = async function (request, response) {
    console.log("Request Body : ", request.body);
    if (!request.body.email || request.body.email == undefined || request.body.email == null) return response.send(422, {"message" : "Please send email Address in Body in JSON format where key being *email* "});
    else if (emailValidator.validate(request.body.email)) {
        const blocked = await Blocked.find({email : request.body.email});
        if (blocked == null || blocked == undefined) response.send(200, {"message" : "This email is blocked due to 5 wrong authentication, Retry after 3600 seconds"});
        else{
            var otp;
            while(true){
                otp = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
                const ootp = await OTP.findOne({otp : otp});
                if (ootp) continue;
                else break;
            }
            console.log('hello' , otp);
            const user = await Authentication.findOne({email : request.body.email});
            if(user){
                const timeDifference = Math.floor(((new Date()) - user.updatedAt) /1000);
                if(timeDifference > 60){
                    user.otp = otp;
                    user.save();
                    //const otpAdd = await OTP.create({otp : otp});
                    return response.json(200, {"message" : "New OTP generated successfully", "opt" : otp});
                }else return response.json(422, {"message" : "New OTP can be generated only after 60 seconds. Please re-try after 60 seconds"});
                
            }else{
                const user = await Authentication.create({
                    email : request.body.email,
                    otp : otp,
                    counter : 0
                });
                //const otpAdd = await OTP.create({ otp: otp });
                console.log(user);
                return response.json(200, { "message": "OTP generated successfully", "opt": otp });
            }
           
        }
        
    } else return response.send(422, { "message": "Email is Invalid, Please re-enter email address"});

    
}