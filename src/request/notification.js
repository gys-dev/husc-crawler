const Request = require('request');
const ENV = require('../constant');
const Helper = require('../helper/helper').Helper;
class Notification{
    constructor(cookieArray){
        this.cookieArray = cookieArray;
    }

    async getRequestNotification(callback){
        let date = Date.now();
        let hash = "13f4a4b45199a150a19998097a64133ad5f6653a3ac9578c6039465155f5d77bc11d6d61"
        let urlRequest = ENV.URL_NOTIFICATION + date + '?umst=' + hash;
        let options = Helper.generateOptionHeader('/','POST',this.cookieArray);

        let request = await new Request(urlRequest,options,(error, response, body) =>{
            if (error){
                throw error;
            };
            callback(body);
        })
        
    }
    getUnreadMessages(callback){
        var result = -1;
        this.getRequestNotification((res) =>{
            result = JSON.parse(res).UnreadMessages;
            callback(result);
        }).catch((err)=>{
            if (err){
                throw err;
            }
        })
    }
    getStudyEvents(callback){
        var result = -1;
        this.getRequestNotification((res) =>{
            result = JSON.parse(res).StudyEvents;
            callback(result);
        }).catch((err)=>{
            if (err){
                throw err;
            }
        })
    }
    
    getExaminationEvents(callback){
        var result = -1;
        this.getRequestNotification((res) =>{
            result = JSON.parse(res).ExaminationEvents;
            callback(result);
        }).catch((err)=>{
            if (err){
                throw err;
            }
        })
    }


}
module.exports.Notification = Notification;