const User = require('../models/Users');
const userUtil =require('../utils/userUtil');
const otpUtil = require('../utils/otpUtils');

//receives otp and token

module.exports = function(app){
    app.post('/verify-otp',(req,res)=>{
        const token = req.body.token;
        const otp = req.body.otp;
        const user_phone = req.body.user_phone;

        if(!token){
            return res.send({
                success:false,
                message:'Token cannot be blank'
            });
        }

        if(!otp){
            return res.send({
                success:false,
                message:'OTP cannot be blank'
            });
        }

        otpUtil.fetchOtp(token)
        .then((otpData)=>{
            if(otpData){
                otpUtil.otpActions(otp,user_phone,otpData)
                .then((resp)=>{
                    console.log(resp);
                    res.send(resp);
                })
            }
            else{
                return res.send({
                    success:false,
                    message:'Invalid Token/Otp Expired!'
                });
            }
        })

    });
}