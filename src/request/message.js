const Request = require('request');
const ENV = require('../constant');
const Helper = require('../helper/helper').Helper;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const MessageDom = require('../dom/MessageDom').MessageDom

class Message{
    constructor(cookieArray){
        this.cookieArray = cookieArray;
    }
    async getRequestMessage(page,callback){
        let urlRequest = ENV.URL_MESSAGE_INBOX
        let postData = {page: page, search: ""};
        let options = Helper.generateOptionBodyHeader('/','POST',postData,this.cookieArray);

        let request = await new Request(urlRequest,options,(error, response, body) =>{
            if (error){
                throw error;
            };
            callback(body);
        }) 
    }
    /*
        TODO: Get All Message With Page
        @parameter
            page: number page. Default is 1
            callback: call back with list array MessageDom
    */
    getMessageList(page = 1,callback){
        this.getRequestMessage(page,(result)=>{
            let jsdom = new JSDOM(result);
            let trSelector = jsdom.window.document.getElementsByTagName('tr');
            let listMessageDom = [];
            
            for (let index = 0; index < trSelector.length; index++) {
                let messageDom = MessageDom.parseFromHTMLTableRowElement(trSelector[index])
                listMessageDom.push(messageDom);
            }
            callback(listMessageDom);
        }).catch((err)=>{
            if (err){
                throw err;
            }
        });
    }
    /*
        TODO: Get All Unread Message With Page
        @parameter
            callback: call back with list array MessageDom
    */
    getUnreadMessageList(callback){
        this.getRequestMessage(1,(result)=>{
            let jsdom = new JSDOM(result);
            let trUnread = jsdom.window.document.querySelectorAll("tr[style='font-weight:bold !important']");
            let listUnreadMessage = [];

            for (let index = 0; index < trUnread.length; index++) {
                let messageDom = MessageDom.parseFromHTMLTableRowElement(trUnread[index]);
                listUnreadMessage.push(messageDom);
            }
            callback(listUnreadMessage);
        }).catch((err)=>{
            if (err){
                throw err;
            }
        });
    }
}

module.exports.Message = Message;