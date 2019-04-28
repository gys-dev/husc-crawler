const ENV = require('../constant');
const Request = require('request');

class Helper{

    /*
        TODO: Generate Cookie String
    */
    static generateCookieString(name,value,domain,hostOnlyStatus,path,secureStatus,httpOnlyStatus,sessionStatus){
        return `${name}=${value}; domain=${domain}; hostOnly=${hostOnlyStatus}; path=${path}; secure=${secureStatus}; httpOnly=${httpOnlyStatus}; session=${secureStatus}`;
    };
    
    /*
        TODO: check file exist
        @paramater
            path: Path String of File
    */
    static isCreated(path){
        return fs.existsSync(path);
    }  ;

    /*
        TODO: Generate Option include header to Make A Request
        @parameter
            path: String Path of header
            method: 'GET' | 'POST' | 'PUT' | 'DELETE'
            cookieArray: Array of Cookie
                        [
                            Request.cookie
                        ]

    */
   static generateOptionHeader(path,method,cookieArray){
        var options = {
            hostname: ENV.HOSTNAME,
            path: path,
            method: method,
            headers: {
                'User-Agent': ENV.USER_AGENT,
                'Cookie': cookieArray,
                'Accept': '/',
                'Connection': 'keep-alive'
            }  
      };
      return options;
      
    }

    static generateOptionBodyHeader(path,method,para,cookieArray){
        var options = {
            hostname: ENV.HOSTNAME,
            path: path,
            method: method,
            formData: para,
            headers: {
                'User-Agent': ENV.USER_AGENT,
                'Cookie': cookieArray,
                'Accept': '/',
                'Connection': 'keep-alive'
            }  
      };
      return options;
      
    }

    /*
        TODO: Check object empty
    */
    static isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    /*
        TODO: Generate Cookie List to put into header requesta
    */
    static generateCookieArray(cookies){
        var cookieArray = [];
        if (!this.isEmpty(cookies)){
            cookies.forEach((element) =>{
                let cookieString = this.generateCookieString(element.name,element.value,element.domain,element.hostOnly
                    ,element.path,element.secure,element.hostOnly,element.session);
                let cookie = Request.cookie(cookieString)
                cookieArray.push(cookie);
            })
            return cookieArray;
        }
    }
}
module.exports.Helper = Helper;