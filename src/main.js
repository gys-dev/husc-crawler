const Helper = require('./helper/helper').Helper;
const LoginUMS =  require('./login script/login.js');
const ENV = require('./constant');
var session = require('./session/cookies.json');
var LoginStatus = require('./session/LoginStatus.json');
const Request = require('request')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Config = require('./user/config.json')
const Message = require('./request/message').Message
const Noti = require('./request/notification').Notification
const login = require("facebook-chat-api");

if (!LoginStatus.status){
    // NOT LOGIN YET
    LoginUMS.loginUMSAccout(()=>{
        handleRequest();
    }).catch((error) =>{
        throw(error)
    })
}else{
    // LOGINED
    handleRequest();
    
};

function handleRequest(){
    let urlInbox = ENV.URL_MESSAGE_INBOX;
    let cookieArray = [];
    let cookies = session;
    
    if (!Helper.isEmpty(cookies)){
        cookieArray = Helper.generateCookieArray(cookies);
    }

    let oldUnReadMessage = 0
    login({email: Config.fbUserName, password: Config.fbPass}, (err, api) => {
        if(err) return console.error(err);
        
        setInterval(()=>{
            let rqNoti = new Noti(cookieArray)
            let rqMess = new Message(cookieArray)

            rqNoti.getUnreadMessages((unReadCount)=>{
                let unReadMess = parseInt(unReadCount);

                if (unReadMess > 0 && unReadMess != oldUnReadMessage){

                    oldUnReadMessage = unReadMess
                    api.sendMessage("Bạn Có tin nhắn chưa đọc", Config.ownerFBID);
                    rqMess.getUnreadMessageList((result)=>{
                        result.forEach((message)=>{
                            api.sendMessage(`Tên Người Gửi: ${message.senderName}\nLink: ${message.link}\nNội dung: ${message.title}`, Config.ownerFBID);
                        })
                    })
                }
            }) 
        },1000)
       
    });
   

    
}
