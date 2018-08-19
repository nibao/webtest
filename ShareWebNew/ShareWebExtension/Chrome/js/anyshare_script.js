/**
 * Created by Administrator on 2015/8/4.
 */
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request && request.name){
            if(request.name == "message"){
                tip(request.greeting);
            }
            if(request.name == "getCookie"){
                sendResponse({ cookie: document.cookie });
            }
        }
    });
var count = 0;
var tip = function(str){
    count ++;
    var close_id = "anyshare_a_close" + count;
    var logo = chrome.extension.getURL("img/icon-16.png");
    var close = chrome.extension.getURL("img/close.png");
    var tip = chrome.extension.getURL("img/vtip_arrow.png");
    var oDiv = document.createElement('div');
    oDiv.setAttribute('style','position:fixed;z-index:9999;padding:10px;background:#fff;top:10px;right:10px;float:right;color:#000;font-size:12px;');
    oDiv.innerHTML = str;
    oDiv.innerHTML = '<img style="position: absolute;top: -10px; right: 10px;" src="'+ tip +'"><table style="position:relative;z-index:4;border-spacing: 0;"><tr><td><img src="'
        + logo +'"></td><td style="padding: 0 10px">'
        + str +'</td><td><a href="javascript:;" id="'+ close_id +'" onclick="anyshare_"><img src="'+ close +'" width="16px" height="16px" /></a></td></tr></table>';
    document.body.appendChild(oDiv);
    document.querySelector('#'+ close_id).addEventListener('click',function(){
        document.body.removeChild(oDiv);
    },false);
    setTimeout(function(){
        document.body.removeChild(oDiv);
    },3000);

}