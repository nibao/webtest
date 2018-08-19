/**
 * Created by Administrator on 2015/7/24.
 */

var block = 1 * 1024 * 1024;
var account;
var password;
var login = false;
function isLogin(){
    return login;
}
function isRemember(){
    account = $.cookie("account");
    password = $.cookie("password");
    return account && password;
}
function getServices() {
    var service_host = localStorage.getItem("service_host");
    var doc_host = localStorage.getItem("doc_host");
    return service_host && doc_host;
}
//监听消息
/*function RegisterEventListener(){
    chrome.downloads.onCreated.addListener(function(item) {
        if (isLogin()) {
            if (confirm("是否上传至AnyShare")) {
                chrome.downloads.cancel(item.id, function () {
                    getCookie(function (resp) {
                        var userid = $.cookie("userid");
                        addDownload(userid, item.url, "", resp.cookie);
                        sendMessage("已添置下载列表");
                        downloadandupload(item.url);
                    });
                });
                // 删除下载记录，有时默认下载会先执行，因为异步，防止出现默认下载框
                chrome.downloads.erase({ id: item.id },
                    function (ids) {
                        //
                    }
                );
                // 关闭chrome新建下载留存的tab
                chrome.tabs.query({ url: item.url },
                    function queryResult(tabArray) {
                        if (tabArray[0]) {
                            chrome.tabs.remove(tabArray[0].id);
                        }
                    }
                );
                return;
            }
        }
    });
}
// 更新工具栏tips
function UpdataToolbarTips(text){
    chrome.browserAction.setTitle({title:text});
}
// 创建右键菜单
function CreateContextMenu(bEnableMenu){
    chrome.contextMenus.create({id:"AnyShareContextMenu", type:"normal", title:"下载到AnyShare", contexts:["link"], onclick:onDownLoadToAS, enabled:bEnableMenu});
}
// 更新右键菜单
function UpdateContextMenu(bEnableMenu){
    chrome.contextMenus.update("AnyShareContextMenu", {enabled:bEnableMenu});
}*/
// 验证url
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
// menu click
/*function onDownLoadToAS(info) {
    var userid = $.cookie("userid");
    if (isURL(info.linkUrl)) {
        if (!selDownload(userid, info.linkUrl)){
            chrome.cookies.getAll({ url: info.pageUrl }, function(cookies) {
                var cookie = "";
                for (var i in cookies) {
                    cookie = cookie.concat(cookies[i].name, "=", cookies[i].value, "; ");
                };
                addDownload(userid,info.linkUrl,"",cookie);
                sendMessage("已添置下载列表");
                downloadandupload(info.linkUrl);
            });
        }
        else
            sendMessage("已在下载中");
    }
    else{
        sendMessage("此链接不合法！");
    }
}

function sendMessage(msg){
    chrome.tabs.query(
        {active: true, currentWindow: true},
        function(tabs) {
            if(tabs&&tabs.length>0){
                chrome.tabs.sendMessage(tabs[0].id, {name:"message",greeting:msg});
            }
    });
}
function getCookie(callback){
    chrome.tabs.query(
        {active: true, currentWindow: true},
        function(tabs) {
            if(tabs&&tabs.length>0){
                chrome.tabs.sendMessage(tabs[0].id, {name:"getCookie"},callback);
            }else{
                callback("");
            }
        });
}
function downloadandupload(url){
    var userid = $.cookie("userid");
    var xhr = new window.XMLHttpRequest();
    xhr.responseType = "blob";
    var filename = "";
    xhr.onload =function(){
        filename = getFileName(xhr);
        if(!filename){
            sendMessage("此链接非下载链接");
            delDownload(userid,url);
            return;
        }
        var stream = xhr.response;
        var dir = anyshare_defaultSaveFolder(getSavePath(userid));
        if(dir != null){
            anyshare_upload_file_asyn(url,stream,dir.docid,filename,function(upload){
                if(upload.status == 0){
                    delDownload(userid,url);
                    sendMessage("检测到有任务完成！");
                }
                else{
                    editDownload(userid,url,-1,filename,1,0);
                    sendMessage("检测到任务失败！");
                }
            },function(progress){
                editDownload(userid,url,0,filename,1,progress);
            });
        }
    };
    xhr.onerror = function(){
        editDownload(userid,url,-1,filename,0,0);
        sendMessage("检测到任务失败！");
    };
    xhr.onprogress = function(event) {
        if(!selDownload(userid,url))
            xhr.abort();
        else if (event.lengthComputable) {
            if(!filename){
                filename = getFileName(xhr);
            }
            var percentComplete = event.loaded / event.total;
            editDownload(userid,url, 0,filename,percentComplete,0);
        }
    };
    xhr.onabort = function(){

    };
    xhr.open("get", url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.send(null);
}*/
function getFileName(xhr){
    var Content_Disposition = xhr.getResponseHeader("Content-Disposition");
    if(!Content_Disposition){
        return "";
    }
    var filename = Content_Disposition.replace("attachment;","")
        .replace(/.*filename=/,"").replace(/;.*/,"").replace(/"/g,"").trim();
    if(!filename){
        return "";
    }
    return urldecode(filename);
}
/*function setLogin(status){
    if(status){
        UpdataToolbarTips("AnyShare");
    }
    else{
        UpdataToolbarTips("登录到AnyShare");
    }
    UpdateContextMenu(status);
    login = status;
}
function redownload(url,cookie){
    if(cookie){
        var cookies = cookie.split(";");
        for(var  i= 0;i< cookies.length;i++){
            var item = cookies[i].split("=");
            if(item.length == 2){
                chrome.cookies.set({
                    url:url,
                    name:item[0].trim(),
                    value:item[1].trim()
                });
            }
        }
    }
    downloadandupload(url);
}
function redownloadall(){
    var userid = $.cookie("userid");
    var downloads = selAllDownload(userid);
    if(downloads && downloads.length > 0){
        for(var i =0;i<downloads.length;i++){
            redownload(downloads[i].url,downloads[i].cookie);
        }
    }
}*/
var anyshare_login = function(account,password,encrypted,remember){
    password = encrypted ? password : encrypt(password);
    var result ={
        status:-2
    };
    var service_host = localStorage.getItem("service_host");
    $.ajax({
        type: "post",
        async: false,
        url: service_host + "v1/auth1?method=getnew",
        data: $.toJSON({
            account: account,
            password: password
        }),
        success: function (data) {
            data = $.parseJSON(data);
            if(remember) {
                $.cookie("password",password ,{expires:7});
            }
            else{
                $.cookie("password",password,{expires:-1});
            }
            $.cookie("account",account,{expires:7});
            $.cookie("userid",data.userid);
            $.cookie("tokenid",data.tokenid);
            if(!getSavePath(data.userid))
                setSavePath(data.userid,default_save_path);
            result.data = data;
            result.status = 0;
        },
        error: function (xhr, rs, error) {
            result.status = -1;
            try{
                var err = $.parseJSON(xhr.responseText);
                result.errorMsg = err.errmsg;
            }
            catch(e){
                console.log(xhr.status);
                result.errorMsg =  xhr.responseText?xhr.responseText:xhr.statusText;
            }
            console.log(result.errorMsg);
        }
    });

    return result;
}
function Init(){
    if(getServices() && isRemember()){
        var result = anyshare_login(account,password,true,true);
        if(result.status == 0){
            self.port.emit("show",JSON.stringify({
                "loginStatus":true,
                "serviceStatus":true
            }));
            console.log("AnyShare");
            login = true;
            //redownloadall();
        }else{
            self.port.emit("show",JSON.stringify({
                "loginStatus":false,
                "serviceStatus":true
            }));
            console.log("登录到AnyShare");
            login = false;
        }
    }
    else{
        self.port.emit("show",JSON.stringify({
            "loginStatus":false,
            "serviceStatus":false
        }));
        console.log("登录到AnyShare");
        login = false;
    }
}
Init();

