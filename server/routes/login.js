const User = require('../models/Users');
const userUtil =require('../utils/userUtil');

module.exports = function(app){
   
    app.options('/login',(req,res)=>{
        res.status(200);
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "POST");  
        res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
        res.send();
    })

    app.post('/login',(req,res)=>{
        let {username,password,dev_token,dev_info,os,user_type} = req.body;

        if(!username){
            res.send({
                success:false,
                message: "Username can't be blank"
            });
        }
        else if(!password){
            res.send({
                success:false,
                message: "Password can't be blank"
            });
        }
        else if(!dev_token){
            res.send({
                success:false,
                message: "dev_token can't be blank"
            });
        }
        else if(!dev_info){
            res.send({
                success:false,
                message: "dev_info can't be blank"
            });
        }

        if(!os){
            os = '';
        }

        if(user_type){
            user_type = 'user';
        }

       userUtil.getUser(username)
        .then((result)=>{
            if(result.result){
                const curUser = result.result;
                if(!curUser.validatePassword(password)){
                    throw new Error("Error: Invalid Credentials");
                }else{
                    return userUtil.setSession(curUser.username);
                }
            }
            else{
                throw new Error("Error: Invalid Credentials");
            }
        })
        .then((result)=>{
            if(result.success){
                res.send({
                    success:true,
                    message:'sessions established',
                    token:result.token
                })
            }else{
                throw new Error("Error: Some Error Occured");
            }
        })
        .catch(err=>{
            console.log(err);
            res.send({
                success:false,
                message:err.message
            })
        });
    })
}
