const User = require('../models/Users');
const userUtil =require('../utils/userUtil');
const otpUtil =require('../utils/otpUtils');
const Otp = require('../models/Otp');

module.exports = function (app) {
    app.post('/signup', function (req, res) {
        let {user_fname,user_lname,user_email,user_phone,password} = req.body;

        if(!user_fname){
            return res.send({
                success:false,
                message:'Error: first name cannot be blank'
            })
        }

        else if(!user_lname){
            return res.send({
                success:false,
                message:'Error: lastname name cannot be blank'
            })
        }

        userUtil.isEmailUnique(user_email)
        .then((result)=>{
            if(result.result){
                return userUtil.isMobileUnique(user_phone);
            }else{
                if(result.email_status == 'y'){
                    throw new Error("Error:Another verified user exists with this email")
                }
                else{
                    let err = new Error("Email clashes with another(non-verified/flagged) email");
                    err.email_flag = result.email_status;
                    throw err;
                }
            }
        })
        .then((result)=>{
            if(result.result){
                const newUser = new User({user_fname,user_lname,user_email,user_phone,username:user_email});
                const pass = newUser.generateHash(password);
                newUser.password = pass;
                
                return otpUtil.fetchOtp('','phone','signup','',user_phone,newUser);

            }else{
                throw new Error("Error:Mobile No already exists")
            }
        })
        .then((result)=>{
            const newUser = new User({user_fname,user_lname,user_email,user_phone,username:user_email});
            const pass = newUser.generateHash(password);
            newUser.password = pass;

            newOtpToken = '';
            if(result){
                newOtpToken = result.token;
                otpUtil.smsOtp(result.user_phone,newOtpToken,result.purpose)
                .then((resp)=>{
                    res.send({
                        response:35,
                        error:false,
                        success:true,
                        message:'Complete Mobile OTP challenge to signup',
                        auth_token:newOtpToken
                    });
                })
                .catch(err=>console.log(err));
            }
            else{
                //generating new otp here
                return otpUtil.generateOtp('','phone',user_phone,'signup',newUser).then((result1)=>{
                    newOtpToken = result1.token;
                    res.send({
                        response:35,
                        error:false,
                        success:true,
                        message:'Complete Mobile OTP challenge to signup',
                        auth_token:newOtpToken
                    });
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.send({
                success:false,
                message:err.message,
                email_flag:err.email_flag
            })
        });
    })
}
