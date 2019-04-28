const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const fs = require('fs');
let ENV =  require('../constant');
let account = require('../user/config.json');
let Path = require('path');


/* 
    Login and create cookies
*/


module.exports.loginUMSAccout = async function (callback){
    console.log("Login Account....");
    let status  = false;
    if (account.username != "#" || account.password != "#"){
        await nightmare
        .goto(ENV.URL_LOGIN)
        .type(ENV.USERNAME_INPUT, account.username)
        .type(ENV.PASSWORD_INPUT, account.password)
        .click(ENV.LOGIN_BUTTON)
        .wait(1000)
        .evaluate(() => {
            var text = document.querySelector('#hotNews').innerHTML.text;
            console.log(text);
        })
        .end()
        .cookies.get()
        .then( cookies =>{
            console.log("Writing cookie....")
            fs.writeFile(Path.dirname(__dirname) + '/session/cookies.json',JSON.stringify(cookies), function(err) {
                if (err) {
                    status = false
                    throw(err)
                }
                fs.writeFile(Path.dirname(__dirname) + '/session/LoginStatus.json',JSON.stringify({status: true}),(error) =>{
                    if (error){
                        throw(err);
                    }
                    
                });
                console.log("Writing successfull");
                callback()
                status = true;
            });
            
        })
        .catch(error => {
            status = false
            console.log("Can't Login Account!")
            throw(error);
        });
    }else{    
        console.log("Config First!")
        throw new Error("Config Account in user/config.json")
        return false;
    }
    return status
    
}
