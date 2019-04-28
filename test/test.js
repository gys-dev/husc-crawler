const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })
const Request = require('request')
const tough = require('tough-cookie');
const FileCookieStore = require('tough-cookie-filestore');
const Cookie = tough.Cookie;
const path = require('path');
const fs = require('fs');

function loginUMSAccout(){
  nightmare
  .goto('https://ums-husc.hueuni.edu.vn/Student/Account/Login')
  .type('#loginID', '17T1021318')
  .type('#password', 'tranducy23061999')
  .click('.btn-primary')
  .wait(1000)
  .end()
  .cookies.get()
  .then(cookies =>{
    fs.writeFile(__dirname + '/cookies.json',JSON.stringify(cookies), function(err) {
      if (err) {
          console.log(err);
      }
    });
        
      cookies.forEach(cookie => {
        // var jsonCookie = JSON.stringify(cookie);
        // cook = new Cookie.fromJSON(jsonCookie);
        // console.log(cook);
        
      });
      // fileStoreCookies.add
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
}
let pathCookie = __dirname + '/cookies.json';

if (isCreated(pathCookie)){
  var url = 'https://ums-husc.hueuni.edu.vn/Student/Studying/RegisteredCourses';
  let cookieArray = [];
  fs.readFile(pathCookie,'utf8',(err, result) =>{
    if (err){
      throw(err)
    };
    let jsonCookie = JSON.parse(result);
    jsonCookie.forEach((element) =>{
        cookieString = generateCookieString(element.name,element.value,element.domain,element.hostOnly
          ,element.path,element.secure,element.hostOnly,element.session);
        let cookie = Request.cookie(cookieString)
        console.log(cookie);
        cookieArray.push(cookie);
    })
    var options = {
      hostname: 'ums-husc.hueuni.edu.vn',
      path: '/',
      method: 'GET',
      headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
          'Cookie': cookieArray,
          'Accept': '/',
          'Connection': 'keep-alive'
      }
      //,jar: j
    };
    let request = new Request(url,options,(error, response, body) =>{
      console.log(body);
    })
  });
  
}

function generateCookieString(name,value,domain,hostOnlyStatus,path,secureStatus,httpOnlyStatus,sessionStatus){
  return `${name}=${value}; domain=${domain}; hostOnly=${hostOnlyStatus}; path=${path}; secure=${secureStatus}; httpOnly=${httpOnlyStatus}; session=${secureStatus}`;
}

function isCreated(path){
  return fs.existsSync(path);
}

var umsMessageCurrentPage = 1;
function umsMessageCheckAll(status) {
    $("#__messageList input:checkbox").each(function () {
        $(this).prop("checked", status);
    });
}
function umsGetMessageList2(page) {
    var link = $("#__messageLinkToGetList").val();
    var postData = { page: page, search: $("#__messageSearch").val() };
    $.ajax({
        url: link,
        type: "POST",
        data: postData,
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        error: function () {
            alert("Your request is not valid!");
        },
        success: function (data) {
          console.log(data);
        }
    });
}
function umsShowMessageAlert(type, msg) {
    var t = "<div class='alert alert-"+ type +" '><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" + msg + "</div>";
    $("#__messageAlert").html(t);
}
function umsInitMessageCreate()
{
    //search message users
    $("#receivers").select2({
        ajax: {
            url: createBaseLink("Message/SearchMembers"),
            dataType: 'json',
            data: function (params) {
                return {
                    search: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination: {
                        more: !data.finish
                    }
                };
            },
            delay: 1000,
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: umsFormatMessageUsers,
        placeholder: "",
        minimumInputLength: 2,
        multiple: true,
        width: 'resolve'
    });
    //tinyMCE Editor
    tinymce.init({
        selector: '#content',
        branding: false,
        menubar: false,
        statusbar: false,
        toolbar_items_size: 'small',
        toolbar: 'bold italic underline subscript superscript | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect | forecolor backcolor | indent outdent ',
        plugins: 'textcolor',
        setup: function (ed) {
            ed.on('init', function () {
                this.execCommand("fontName", false, "Verdana");
                this.execCommand("fontSize", false, "10pt");
            });
        }
    });
}
function umsFormatMessageUsers(result) {
    if (result.loading) return result.text;
    return result.text + '<span style="float:right">' + result.desc + '</span>';
}
function umsMessageSent() {
    tinymce.triggerSave();
    var postData = $("#formMessageCreate").serializeArray();
    $.ajax({
        url: createBaseLink("Message/Send"),
        type: "POST",
        data: postData,
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        error: function () {
            alert("Your request is not valid!");
        },
        success: function (data) {
            if (data.Code !== 1) {
                umsShowMessageAlert('warning', data.Msg);
            }
            else {
                $("#receivers").val(null).trigger("change");
                $("#title").val("");
                tinymce.activeEditor.setContent('');
                umsShowMessageAlert('success', 'Tin nhắn đã được gởi!');
            }
        }
    });
}
function umsMessageTrash(method, prep) {    
    var postData = $("#__formMessageList").serializeArray();
    $.ajax({
        url: createBaseLink("Message/RecycleBin/" + method),
        type: "POST",
        data: postData,
        async: false,
        beforeSend: function () {
            showLoader();
        },
        complete: function () {
            hideLoader();
        },
        error: function () {
            alert("Your request is not valid!");
        },
        success: function (data) {
            if (data.Code === 1) {
                if (document.getElementById("__messageList") !== null) {
                    umsGetMessageList(umsMessageCurrentPage);
                }
                else {
                    window.location.href = createBaseLink("Message/" + prep);
                }                
            }
            else {
                umsShowMessageAlert('warning', data.Msg);
            }            
        }
    });
}

//https://ums-husc.hueuni.edu.vn/Student/api/notifications/1552873153158?umst=13f4a4b45199a150a19998097a64133ad5f6653a3ac9578c6039465155f5d77bc11d6d61