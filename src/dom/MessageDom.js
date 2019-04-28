const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const HTMLTableRowElement = jsdom;
const ENV = require('../constant');
class MessageDom{

    constructor(senderName,link, title,time){
        this.senderName = senderName;
        this.link = link;
        this.title = title;
        this.time = time;
        
    }
    static parseFromHTMLTableRowElement(htmlTableRowElement){
        try{
            let row = htmlTableRowElement

            let listTd = row.getElementsByTagName('td');
            let senderName = listTd[1].innerHTML;
            let link = ENV.HOSTNAME + listTd[2].getElementsByTagName('a')[0].href;
            let title = listTd[2].getElementsByTagName('a')[0].innerHTML.replace(/(\s+){3}/g, '');;
            let time = listTd[3].innerHTML;
            let messageDom = new MessageDom(senderName,link,title,time);

            return messageDom;
        }catch{
            throw new Error("Can't cast type")
        }
    }

}
module.exports.MessageDom = MessageDom;