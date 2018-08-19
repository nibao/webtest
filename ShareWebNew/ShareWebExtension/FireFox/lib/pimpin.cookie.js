/**
 * Created by wxj on 2015/9/22.
 */
//设置cookie
var { Ci } = require('chrome');
var utils = require('sdk/window/utils');
var browserWindow = utils.getMostRecentBrowserWindow();
var window = browserWindow.content;

console.log(window);
console.log(tab);
function setCookie(cname, cvalue, exdays) {
    var str = cname + "=" + escape(cvalue);
    if(exdays>0){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        str +=  "; " + expires;
    }
    document.cookie =  str;
}
//获取cookie
function getCookie(cname) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == cname)
            return unescape(temp[1]);
    }
    return "";
}
//清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}
exports.setCookie = setCookie;
exports.getCookie = getCookie;
exports.clearCookie = clearCookie;
