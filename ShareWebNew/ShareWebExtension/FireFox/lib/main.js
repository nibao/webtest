// add sdk Modules
const { ToggleButton } = require('sdk/ui/button/toggle');
const { XMLHttpRequest, forceAllowThirdPartyCookie } = require("sdk/net/xhr");
var getMostRecentBrowserWindow = require('sdk/window/utils').getMostRecentBrowserWindow;
var openTab = require("sdk/tabs/utils").openTab;
var panels = require("sdk/panel");
var self = require("sdk/self");
var asHandler = require("./anyshare.firefox.js").asHandler;
var storage = require("./anyshare.firefox.js").storage;
const { Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");
var cookieService = Services.cookies;
var account,password,userid,tokenid;
var button = ToggleButton({
    id: "AnyShare-button",
    label: "AnyShare",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: self.data.url("index.html"),
    onHide: handleHide,
    width: 360,
    height:370,
    onMessage:function(data){
        console.log("onMessage:" + data);
        data = JSON.parse(data);
        if(data.key =="getCookie"){
            account = data.value.account;
            password = data.value.password;
        }
        Init();
    },
    onShow:function(){
        /*panel.port.emit("show",JSON.stringify({
            loginStatus:isLogin()
        }));*/
    }
});
var messagePanel = panels.Panel({
    contentURL: self.data.url("message.html"),
    width: 200,
    height:40,
    onShow:function(){
        messagePanel.port.emit("show");
    }
});
messagePanel.port.on("close",function(){
    messagePanel.hide();
});
messagePanel.port.on("click",function(){
    messagePanel.hide();
    panel.show({
        position: button,
        focus:false
    });
});
function sendMessage(msg){
    messagePanel.port.emit("message",msg);
    messagePanel.show({
        position: button,
        focus:false
    });
}
function handleChange(state) {
    if (state.checked) {
        messagePanel.hide();
        panel.show({
            position: button,
            focus:false
        });
    }
}
function handleHide() {
    button.state('window', {checked: false});
}
panel.port.on("getService",function () {
    panel.port.emit("getServiceBack",JSON.stringify({
        "service_host":storage.getServiceHost(),
        "doc_host" : storage.getDocHost()
    }));
});
panel.port.on("close",function(){
    panel.hide();
});
panel.port.on("asHandler",function(data){
    console.log("asHandler:" + data)
    data = JSON.parse(data);
    switch (data.method){
        case "ping":{
            asHandler.anyshare_ping(data.data.service_host,data.data.doc_host,function (result) {
                panel.port.emit("asBack",JSON.stringify({
                    method:"ping",
                    data:result
                }));
            });
            break;
        }
        case "login":{
            asHandler.anyshare_login(data.data.username, data.data.password, data.data.encrypted,function(result){
                panel.port.emit("asBack",JSON.stringify({
                    method:"login",
                    data:result
                }));				
                if(result.status == 0){
                    account = data.data.username;
                    password = data.data.password;
                    userid = result.data.userid;
                    tokenid = result.data.tokenid;
                    button.label ="AnyShare";
                }
                console.log("userid=" + userid + "&tokenid=" + tokenid);
            });
            break;
        }
        case "setUIInfo" :  {
            asHandler.anyshare_userInfo(userid,tokenid,function(result){
                if(result.status == 0)
                    result.savePath = storage.getSavePath(userid);
                panel.port.emit("asBack",JSON.stringify({
                    method:"setUIInfo",
                    data:result
                }));
            });
            break;
        }
        case "getEntryDoc":{
            asHandler.anyshare_getEntryDoc(userid,tokenid,function(result){
                panel.port.emit("asBack",JSON.stringify({
                    method:data.data.backMthod||"getEntryDoc",
                    data:result
                }));
            });
            break;
        }
        case "createFolder":{
            asHandler.anyshare_createFolder(userid,tokenid,data.data.docid,data.data.name,function(result){
                panel.port.emit("asBack",JSON.stringify({
                    method:"createFolder",
                    data:result
                }));
            });
            break;
        }
        case "getFileList":{
            asHandler.anyshare_getFileList(userid,tokenid,data.data.docid,function(result){
                panel.port.emit("asBack",JSON.stringify({
                    method:data.data.backMthod||"getFileList",
                    data:result
                }));
            });
            break;
        }
        case "permCheck":{
            asHandler.anyshare_permCheck(userid,tokenid,data.data.docid,data.data.perm,function(result){
                panel.port.emit("asBack",JSON.stringify({
                    method:data.data.backMthod||"permCheck",
                    data:result
                }));
            });
            break;
        }
        case "folderRename":{
            asHandler.anyshare_folderRename(userid,tokenid,data.data.docid,data.data.name,function(result){
                panel.port.emit("asBack",JSON.stringify({
                    method:"folderRename",
                    data:result
                }));
            });
            break;
        }
        case "webclient":{
            asHandler.anyshare_webclient(userid,tokenid,function(result){
               panel.port.emit("asBack",JSON.stringify({
                    method:"webclient",
                    data:result
                }));
            });
            break;
        }
    }
});
panel.port.on("resize",function(data){
    console.log(data);
    data = JSON.parse(data);
    panel.width = data.width || panel.width;
    panel.height = data.height || panel.height;
});
panel.port.on("openTab",function(url){
    openTab(getMostRecentBrowserWindow(), url);
});
panel.port.on("logout",function(){
    account = null;
    password=null;
    userid=null;
    tokenid=null;
    button.label="登录到AnyShare";
    panel.width = 360;
    panel.height = 290;
});
panel.port.on("setSavePath",function(path){
    storage.setSavePath(userid,path);
    panel.port.emit("setSavePathBack");
});
panel.port.on("selAllDownload",function(){
    selAllDownloadBack();
});
panel.port.on("delDownload",function(data){
    data = JSON.parse(data);
    if(data&&data.url){
        storage.delDownload(userid,data.url);
        selAllDownloadBack();
    }
});
panel.port.on("redownload",function(data){
    console.log(data);
    data = JSON.parse(data);
    if(data&&data.url){
        var downloads = storage.selAllDownload(userid);
        if(downloads && downloads.length > 0){
            for(var i =0;i<downloads.length;i++){
                if(downloads[i].url == data.url && downloads[i].status == -1){
                    redownload(data.url,data.cookie);
                }
            }
        }
    }
});
function selAllDownloadBack(){
    panel.port.emit("selAllDownloadBack",JSON.stringify({
        downloads:storage.selAllDownload(userid)
    }));
}
function redownload(url,cookie){
    if(cookie){
        var cookies = cookie.split(";");
        for(var  i= 0;i< cookies.length;i++){
            var item = cookies[i].split("=");
            if(item.length == 2){
                cookieService.add(url, "/", item[0].trim(), item[1].trim(),false,false,false,3600*24);
            }
        }
    }
    downloadandupload(url);
}
function redownloadall(){
    var downloads = storage.selAllDownload(userid);
    if(downloads && downloads.length > 0){
        for(var i =0;i<downloads.length;i++){
            redownload(downloads[i].url,downloads[i].cookie);
        }
    }
}
//右键菜单
var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
    label: "下载到AnyShare",
    image: self.data.url("./icon-32.png"),
    context: contextMenu.SelectorContext("a[href]"),
    contentScript: 'self.on("click", function (node, data) {' +
                 'var url = node.href;' +
                 'var cookie = document.cookie;'+
                 'var sendText = JSON.stringify({url:url,cookie:cookie});' +
                'self.postMessage(sendText);'+
                'return false;'+
                 '});',
    onMessage: function (data) {
        console.log("contextMenu:\n");
        console.log(data);
        if(!isLogin()){
            sendMessage("请先登录AnyShare!");
            return;
        }
        console.log("downlaod:begin\n");
        console.log(data);
        data = JSON.parse(data);
        onDownLoadToAS(data);
    }
});
function isURL(str_url) {
    var regEx = "^(http|https)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-"
        + "Z0-9\\.&%\\$\\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{"
        + "2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}"
        + "[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|"
        + "[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-"
        + "4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0"
        + "-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,4})(\\:[0-9]+)?(/"
        + "[^/][a-zA-Z0-9\\.\\,\\?\\'\\\\/\\+&%\\$\\=~_\\-@\\!\\:\\*\\(\\)\\$;#]*)*$";
    var re = new RegExp(regEx);
    return re.test(str_url);
}
function getFileName(xhr){
    var Content_Disposition = xhr.getResponseHeader("Content-Disposition");
    console.log(Content_Disposition);
    console.log("getFileName:" + Content_Disposition);
    if(!Content_Disposition){
        return "";
    }
    var filename = Content_Disposition.match(/filename=.*/);
    if(filename&&(filename=filename[0])){
        filename = filename.replace("filename=","").replace(/"/g,"").trim();
    }
    else{
        filename = Content_Disposition.match(/filename\*=.*/);
        if(filename&&(filename=filename[0]))
            filename = filename.replace(/.*''/,"").replace(/"/g,"").trim();
    }
    if(!filename){
        return "";
    }
    return urldecode(filename);
}
function downloadandupload(url){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    var filename = "";
    xhr.onload =function(){
        filename = getFileName(xhr);
        if(!filename){
            sendMessage("此链接非下载链接");
            storage.delDownload(userid,url);
            selAllDownloadBack();
            return;
        }
        var stream = xhr.response;
        var dir = asHandler.anyshare_defaultSaveFolder(userid,tokenid,storage.getSavePath(userid),function(dir){
            console.log(dir);
            if(dir != null){
                asHandler.anyshare_upload_file_asyn(userid,tokenid,url,stream,dir.docid,filename,function(upload){
                    if(upload.status == 0){
                        storage.delDownload(userid,url);
                        selAllDownloadBack();
                        sendMessage("检测到有任务完成！");
                    }
                    else{
                        storage.editDownload(userid,url,-1,filename,1,0);
                        selAllDownloadBack();
                        sendMessage("检测到任务失败！");
                    }
                },function(progress){
                    storage.editDownload(userid,url,0,filename,1,progress);
                    selAllDownloadBack();
                });
            }
        });
    };
    xhr.onerror = function(){
        storage.editDownload(userid,url,-1,filename,0,0);
        selAllDownloadBack();
        sendMessage("检测到任务失败！");
    };
    xhr.onprogress = function(event) {
        if(!storage.selDownload(userid,url))
            xhr.abort();
        else if (event.lengthComputable) {
            if(!filename){
                filename = getFileName(xhr);
            }
            var percentComplete = event.loaded / event.total;
            storage.editDownload(userid,url, 0,filename,percentComplete,0);
            selAllDownloadBack();
        }
    };
    xhr.onabort = function(){
    };
    xhr.open("get", url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.send(null);
}
function onDownLoadToAS(data) {
    if (isURL(data.url)) {
        if (!storage.selDownload(userid, data.url)){
            storage.addDownload(userid, data.url,"",data.cookie);
            selAllDownloadBack();
            sendMessage("已添至下载列表");
            downloadandupload(data.url);
        }
        else
            sendMessage("已在下载中！");
    }
    else{
        sendMessage("此链接不合法！");
    }
}
/*var pageWorker = require("sdk/page-worker").Page({
    onMessage: function(message){
        button.label = message;
    },
    contentScriptFile: [
        self.data.url("../lib/jquery-2.1.1.min.js"),
        self.data.url("../lib/jquery.json.min.js"),
        self.data.url("../lib/jquery.cookie.min.js"),
        self.data.url("../lib/linq.min.js"),
        self.data.url("../lib/anyshare.handle.js"),
        self.data.url("../lib/background.js")
    ]
});
pageWorker.port.on('loaded', function() {
    console.log("loader");
})

pageWorker.port.on("loginStatus",function(status){
    if(status){
        button.label="AnyShare";
    }else{
        button.label="登录到AnyShare";
    }
});*/
function isRemember(){
    return account && password;
}
function isLogin(){
    return userid && tokenid;
}
function getServices() {
    var service_host = storage.getServiceHost();
    var doc_host = storage.getDocHost();
    return service_host && doc_host;
}
function Init(){
    console.log("Init:");
    if(getServices() && isRemember()){
        asHandler.anyshare_login(account, password, true,function(result) {
            panel.port.emit("asBack", JSON.stringify({
                method: "login",
                data: result
            }));
            if (result.status == 0) {
                userid = result.data.userid;
                tokenid = result.data.tokenid;
                button.label = "AnyShare";
                redownloadall();
            } else {
                console.log("1false,true");
                panel.port.emit("pageShow",JSON.stringify({
                    loginStatus:false,
                    serviceStatus:true
                }));
                button.label = "登录到AnyShare";
            }
        });
    }
    else if(getServices()){
        console.log("2false,true");
        panel.port.emit("pageShow",JSON.stringify({
            loginStatus:false,
            serviceStatus:true
        }));
        button.label = "登录到AnyShare";
    }
    else{
        console.log("false,false");
        panel.port.emit("pageShow",JSON.stringify({
            loginStatus:false,
            serviceStatus:false
        }));
        button.label = "登录到AnyShare";
    }
}

function urldecode(str) {
    if(str.match(/%[0-9a-fA-F]{2}/)){
        str = decodeURIComponent(str);
    }
    else if(str.match(/%[uU][0-9a-fA-F]{4}/)){
        str = unescape(str);
    }
    else {
        var escape_name = escape(str);
        if (escape_name.match(/%[0-9a-fA-F]{2}/)) {
            str = decodeURIComponent(escape_name);
        }
        if (escape_name.match(/%[uU][0-9a-fA-F]{4}/)) {
            str = unescape(escape_name);
        }
    }
    return str;
}
/*var pageMod = require("sdk/page-mod");
pageMod.PageMod({
    include: "*",
    contentScriptFile: self.data.url("js/anyshare_script.js"),
    onAttach: function(worker){
        worker.port.emit("getCookie", "");
        worker.port.on("backCookie", function(cookie) {
            console.log(cookie);
        });
    }
});*/
