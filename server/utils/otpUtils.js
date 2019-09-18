var suid = require('rand-token').suid;
const Otp = require('../models/Otp');
const smsUtil = require('./smsUtils');
const User = require('../models/Users');
const userUtil = require('../utils/userUtil');

class OtpUtils{

    static smsOtp(number,otp,purpose = ''){
        let message = `Use ${otp} as OTP to `;
        switch(purpose){
            case 'signup':
                message = message + 'sign up';
                break;
            case 'claimEmail':
                message = message + 'clain your email';
                break;
            case 'forgotPassword':
                message = message + 'reset your password';
                break;
            case 'createMerchant':
                message = message + 'register yourself as merchant';
                break;
        }
        message = message + '.%0aCheers, BillFree!';
        let temp = smsUtil.sendSMS(number,message);
        return temp
    }

    static generateOtp(user_id = '', otp_type = '', address, purpose = '', data = ''){
        const token = suid(16);
        let min = 100000,max = 999999;
        const otp = Math.floor(Math.random() * (max - min + 1) + min);
        let otpModel = new Otp({otp,token,purpose});
        if(user_id){
            otpModel.user_id = user_id;
        }
        if(data){
            otpModel.data = data;
        }
        let curDate = new Date();
        otpModel.expiry_time =  new Date(curDate.getTime() + 30*60000);  //datetime for 30 mins later

        otpModel.otp_type = otp_type;
        otpModel.is_sent = 'y';
        otpModel.status = 'a';

        if(otp_type == 'phone'){
            otpModel.user_phone = address;
            return otpModel.save()
            .then((otpSaved)=>{
                return this.smsOtp(address,otp,purpose);
            })
            .then((resp)=>{
                resp.token = token
                return resp;
            })
        }
        if(otp_type == 'email'){
            otpModel.user_email = address;
            //code to email otp
        }
    }

    static fetchOtp(token = '',otp_type = '',purpose = '',user_email = '',user_phone = '',data = '',status = '',is_verified = false,is_expired = false){
        let obj = {};
        
        if(token){
            obj.token = token;
        }
        
        if(otp_type){
            obj.otp_type = otp_type;
        }
        
        if(user_email){
            obj.user_email = user_email;
        }
        
        if(purpose){
            obj.purpose = purpose;
        }
        
        if(user_phone){
            obj.user_phone = user_phone;
        }

        if(data){
            if(purpose == 'signup'){
                obj["data.user_fname"] = data.user_fname;
                obj["data.user_lname"] = data.user_lname;
                obj["data.user_email"] = data.user_email;
                obj["data.user_phone"] = data.user_phone;
                obj["data.username"] = data.user_email;
                obj["data.password"] = data.password;
            }
        }

        if(status){
            obj.status = status;
        }
        
        obj.is_verified = is_verified;

        let curDate = new Date();

        obj.expiry_time = {
            '$gte':new Date(curDate.getTime())
        }

        obj.attempt_count = {
            '$lte':2
        }

        console.log("========================================");
        console.log(obj);
        return Otp.findOne(obj).exec()
        .then((response)=>{
            console.log(response)
            console.log("========================================");
            return response;
        })
    }

    static otpActions(userOtp,phone = '',otpData){
        const correctOtp = otpData.otp;
        let count = otpData.attempt_count;
        console.log(correctOtp+ '  :  '+ userOtp );
        if(userOtp != correctOtp){
            count = parseInt(count)+1;
            return Otp.findOneAndUpdate({token:otpData.token}, {$set:{attempt_count:count,date_updated:new Date()}}, {new: true}).exec()
            .then((result)=>{
                return {
                    success:false,
                    message:'Wrong OTP',
                    attempt_count:count,
                    response:12
                }
            })
        }
        else{
            switch(otpData.purpose){
                case 'signup':
                    let userData = otpData.data;
                    return Otp.findOneAndUpdate({token:otpData.token}, {$set:{is_verified:true,date_updated:new Date()}}, {new: true}).exec()
                    .then((result)=>{
                        return userUtil.createNewUser(userData);
                    })
                    //any operation in case of tempBills and BfBills should be done here
                    .then((result)=>{
                        console.log(result);
                        return {
                            success:true,
                            message:'Signup Successful',
                            response:13
                        }
                    })
            }
        }
    }
}

module.exports = OtpUtils;