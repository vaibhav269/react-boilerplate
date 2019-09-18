//textlocal is saying invalid credentials Need to fix that
const fetch = require('node-fetch');
var Msg91 = require('msg91-promise');
const fs = require('fs');
const path = require('path');
const textLocalKey = require('../config/env').textLocalKey;
const msg91key = require('../config/env').msg91Key;

class SmsUtils{

    //to should always be an array of numbers or a single number
   static sendSMS(to = '', message = '', mode = 'tl', sender = 'BILLFR',isUnicode = false){
        if(!to || to == '9999999999' || Array.isArray(to) && to.length == 1 && to[0] == '9999999999'){
            return true;
        }
        if(mode == 'tl'){
            
            //message details
            sender = encodeURI(sender);
            let numbers = [];
            if(Array.isArray(to)){
               numbers = to; 
            }else{
                numbers.push(to);
            }
            numbers = numbers.join();
            message = message.replace('%0a','%n'); //replacing new line character to match textlocal template
            message = encodeURIComponent(message);

            let data = new URLSearchParams();
            data.set('apikey',textLocalKey);
            data.set('numbers',numbers);
            data.set('sender',sender);
            data.set('message',message);
            data.set('unicode',isUnicode);

            const body = data.toString();
            
            return fetch('https://api.textlocal.in/send/', {
                    method: 'POST',
                    body:    body,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                })
                .then(res => {
                    return res.json()
                })
                .then(response => {
                    const stream = fs.createWriteStream(path.resolve(__dirname, "../tmp/smslog.txt"), {flags:'a'});
                    stream.write(response + "\n" + message + "\n----------\n");
                    stream.end();
                    return{
                        success:true
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    throw new Error("Error:Message not sent");
                })
        }
        else if(mode == 'msg91'){
            sender = encodeURI(sender);

            const msg91 = Msg91(msg91key,sender,4); //4 is the transactional route code
            
            //message details
            let numbers = to;
            
            return msg91.send(numbers,message)
            .then(response=>{
                const stream = fs.createWriteStream(path.resolve(__dirname, "../tmp/smslog.txt"), {flags:'a'});
                stream.write(response + "\n" + message + "\n----------\n");
                stream.end();
                return{
                    success:true,
                    response:response
                }
            })
            .catch(err=>{
                console.log(err);
                throw new Error("Error:Message not sent");
            });
        }
   }
}

module.exports = SmsUtils;