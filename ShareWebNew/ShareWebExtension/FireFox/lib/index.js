$(function () {
    var Folder_NO_Edit = "对该文件夹没有修改权限";
    var asHandlerStatus = false;
    var $_li;//the li double clicked
    var $_p;//the p double clicked
    var $_title_a;
    addon.postMessage(JSON.stringify({
        key:"getCookie",
        value:{
            account:$.cookie("account"),
            password:$.cookie("password")
        }
    }));
    $(".close a").click(function(){
        addon.port.emit("close","");
    });
    $(".div_checkbox a").click(function () {
        addon.port.emit("getService");
    });
    addon.port.on("getServiceBack",function (data) {
        data = JSON.parse(data);
        var service_host = data.service_host;
        var doc_host = data.doc_host;
        if(service_host && doc_host) {
            service_host = service_host.substring(0,service_host.length-1);
            doc_host = doc_host.substring(0,doc_host.length-1);
            $("#host").val(service_host.substring(0,service_host.lastIndexOf(":")));
            $("#aPort").val(service_host.substring(service_host.lastIndexOf(":")+1));
            $("#dPort").val(doc_host.substring(doc_host.lastIndexOf(":")+1));
        }
        $("div.login").hide();
        $("div.service").show();
        addon.port.emit("resize",JSON.stringify({
            height:370
        }));
    });
    $("#btn_setService").click(function () {
        $(this).next(".error").text("").hide();
        var host = $("#host").val();
        var aPort = $("#aPort").val();
        var dPort = $("#dPort").val();
        if(!host) {
            tip("请填写服务器地址！").show();
            return;
        }
        if(!aPort) {
            tip("请填写应用端口！").show();
            return;
        }
        if(!dPort) {
            tip("请填写数据端口！").show();
            return;
        }
        $("#btn_setService").attr("disabled", true);
        var service_host = host + ":" + aPort +"/";
        var doc_host = host + ":" + dPort +"/";
        addon.port.emit("asHandler",JSON.stringify({
            method:"ping",
            data:{
                service_host:service_host,
                doc_host:doc_host,
            }
        }));
    });
    $("#login").click(function () {
        if(asHandlerStatus)
            return;
        var username = $("#username").val();
        var password = $("#password").val();
        if (!username){
            tip("用户名不能为空！");
            return;
        }
        if (!password){
            tip("密码不能为空！");
            return;
        }
        asHandlerStatus = true;
        addon.port.emit("asHandler",JSON.stringify({
            method:"login",
            data:{
                username:username,
                password:password,
                encrypted:false
            }
        }));
        //test
        /*$("div.login").hide();
        addon.port.emit("resize",JSON.stringify({
            height:480
        }));
        $("div.download").show();*/
    });

    addon.port.on("asBack",function(data){
        data = JSON.parse(data);
        switch(data.method){
            case "ping":{
                if(data.data.status == 0){
                    $("div.login").show();
                    $("div.service").hide();
                    addon.port.emit("resize",JSON.stringify({
                        height:290
                    }));
                }else
                    tip("服务连接失败，请确保服务器地址与端口正确，及网络正常！");
                $("#btn_setService").attr("disabled", false);
                break;
            }
            case "login":{
                if(data.data.status == 0){
                    if(data.data.save || $("#checkbox").is(":checked")) {
                        $.cookie("password",data.data.pwd ,{expires:7});
                    }
                    else{
                        $.cookie("password",data.data.pwd,{expires:-1});
                    }
                    $.cookie("account",data.data.account,{expires:7});
                    $.cookie("userid",data.data.data.userid);
                    $.cookie("tokenid",data.data.data.tokenid);
                    //setUIInfo
                    addon.port.emit("asHandler",JSON.stringify({
                        method:"setUIInfo"
                    }));
                    $("div.login").hide();
                    $("div.service").hide();
                    addon.port.emit("resize",JSON.stringify({
                        height:480
                    }));
                    $("div.download").show();
                }else
                    tip("用户名或密码不正确");
                asHandlerStatus = false;
                return;
            }
            case "setUIInfo":{
                if(data.data.status == 0 && data.data.data){
                    $("#account_name").text(data.data.data.name);
                    $("#save_path_txt").val(data.data.savePath);
                }
                return;
            }
            case "getEntryDoc":{
                var entryDoc = data.data;
                if(entryDoc.status==0 && entryDoc.data){
                    var list ="";
                    $.each(entryDoc.data.rootdirs,function(index,dir){
                        list += "<li data-data='" + JSON.stringify(dir) + "'>"
                            +"<a href='javascript:;'></a>"
                            +"<p>" + dir.name +"</p></li>";
                    });
                    $("#title .root").nextAll().remove();
                    $("#folder").empty().append($(list));
                    addon.port.emit("resize",JSON.stringify({
                        width:580,
                        height:393
                    }));
                    $("#page_login").hide();
                    $("#page_folder").show();
                }
                else{
                    tip(entryDoc.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "getEntryDoc_T":{
                var entryDoc = data.data;
                if(entryDoc.status==0 && entryDoc.data){
                    var list ="";
                    $.each(entryDoc.data.rootdirs,function(index,dir){
                        list += "<li data-data='" + JSON.stringify(dir) + "'>"
                            +"<a href='javascript:;'></a>"
                            +"<p>" + dir.name +"</p></li>";
                    });
                    $("#folder").empty().append($(list));
                    $_title_a.nextAll().remove();
                }
                else{
                    tip(entryDoc.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "createFolder":{
                var newFolder = data.data;
                if(newFolder.status == 0 && newFolder.data){
                    var dir =  $("#title a:last-child").data("data");
                    dir.sublist.dirs.push(newFolder.data);
                    $_li.data("data", JSON.stringify(dir));
                    var li ="<li data-data='" + JSON.stringify(newFolder.data) + "'>"
                        +"<a href='javascript:;'></a>"
                        +"<p>" + newFolder.data.name +"</p></li>";
                    $_li.after($(li));
                    $_li.next().find("a").trigger("click");
                }
                else{
                    tip(newFolder.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "getFileList":{
                var sublist = data.data;
                if(sublist.status == 0 && sublist.data){
                    var list = "<li class='folder_add'>"
                        +"<a href='javascript:;'></a>"
                        +"<p>新建文件夹</p></li>";
                    if(sublist.data.dirs.length > 0){
                        $.each(sublist.data.dirs,function(index,subdir){
                            list +="<li data-data='" + JSON.stringify(subdir) + "'>"
                                +"<a href='javascript:;'></a>"
                                +"<p>" + subdir.name +"</p></li>";
                        });
                    }
                    $("#folder").empty().append($(list));
                    var dir = $_li.data("data");
                    $("#title").append("<span>-></span><a href='javascript:;' data-data='"
                        +JSON.stringify(dir) +"'>" + dir.name +"</a>");
                }
                else{
                    tip(sublist.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "getFileList_T":{
                var sublist = data.data;
                if(sublist.status == 0 && sublist.data){
                    var list = "<li class='folder_add'>"
                        +"<a href='javascript:;'></a>"
                        +"<p>新建文件夹</p></li>";
                    if(sublist.data.dirs.length > 0){
                        $.each(sublist.data.dirs,function(index,subdir){
                            list +="<li data-data='" + JSON.stringify(subdir) + "'>"
                                +"<a href='javascript:;'></a>"
                                +"<p>" + subdir.name +"</p></li>";
                        });
                    }
                    $("#folder").empty().append($(list));
                    var dir = $_li.data("data");
                    $_title_a.nextAll().remove();
                }
                else{
                    tip(sublist.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "permCheck_OK":{
                var result = data.data;
                if (result.status == 0 && result.data.result == 0) {
                    var path = "";
                    $.each($("#title a"), function (index, item) {
                        if (!$(item).hasClass("root")) {
                            path += "/" + $(item).text();
                        }
                    });
                    path += "/" + $_li.find("p").text();
                    $("#save_path_txt").val(path);
                    addon.port.emit("resize",JSON.stringify({
                        height:370,
                        width:560
                    }));
                    $("#page_folder").hide();
                    $("#page_login").show();
                }
                else {
                    tip(result.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "permCheck_P_db":{
                var result = data.data;
                if (result.status == 0 && result.data.result == 0) {
                    $_p.attr("contenteditable",true);
                    $_p.blur(function(){
                        var dir =$_p.parent().data("data");
                        var value = $_p.text();
                        if(dir.name != value){
                            $_p.text(dir.name);
                        }
                        $_p.attr("contenteditable",false);
                    });
                }
                else{
                    tip(result.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "folderRename":{
                var result = data.data;
                var dir = $_p.parent().data("data");
                if(result.status == 0 && result.data){
                    $_p.text(result.data.name);
                    dir.name = result.data.name;
                    $_p.parent().data("data", dir);
                    $_p.attr("contenteditable",false);
                }
                else{
                    tip(result.errorMsg);
                }
                asHandlerStatus = false;
                return;
            }
            case "webclient":{
                var url = "http://share.eisoocloud.com";
                var result = data.data;
                if(result.status == 0 && result.data){
                    if(result.service_host.indexOf("https") === 0){
                        url = "https://" + result.data.host + ":" + result.data.https_port;
                    }
                    else
                        url = "http://" + result.data.host + ":" + result.data.port;
                }
                addon.port.emit("openTab", url);
                return;
            }
        }
    });
    addon.port.on("pageShow",function(data){
        data =JSON.parse(data);
        if(data && data.loginStatus){
            addon.port.emit("asHandler",JSON.stringify({
                method:"setUIInfo"
            }));
            $("div.login").hide();
            $("div.service").hide();
            $("div.setting").hide();
            $("#page_folder").hide();
            addon.port.emit("resize",JSON.stringify({
                height:485,
                width: 360//400
            }));
            $("#page_login").show();
            $("div.download").show();
        }else if(data && data.serviceStatus){
            $("div.login").show();
            $("div.service").hide();
            addon.port.emit("resize",JSON.stringify({
                height:290
            }));
        }
    });
    $("#open_webAS").click(function() {
        addon.port.emit("asHandler",JSON.stringify({
            method:"webclient"
        }));
    });
    $("#setting").click(function(){
        addon.port.emit("resize",JSON.stringify({
            height:370,
            width:560
        }));
        $("div.download").hide();
        $("div.setting").show();
    });
    $("#logout").click(function(){
        $.cookie("account",null,{expires:-1});
        $.cookie("password",null,{expires:-1});
        addon.port.emit("logout");
        $("div.setting").hide();
        $("div.login").show();
    });

    //page_folder btn_cancle click
    $("#btn_cancle").click(function(){
		addon.port.emit("resize",JSON.stringify({
			height:370,
			width:560
		}));
		$("#page_folder").hide();
		$("#page_login").show();
        //addon.port.emit("close","");
    });
    //setting browse
    $("#browse").click(function(){
        if(asHandlerStatus)
            return;
        asHandlerStatus = true;
        addon.port.emit("asHandler",JSON.stringify({
            method:"getEntryDoc",
            data:{
                backMthod:"getEntryDoc"
            }
        }));
    });
    // setting st_complete
    $("#st_complete").click(function(){
        addon.port.emit("setSavePath",$("#save_path_txt").val());
    });
    addon.port.on("setSavePathBack",function(){
		tip("设置成功！",function(){
            //addon.port.emit("close");
			addon.port.emit("resize",JSON.stringify({
				height:485,
				width:360//400
			}));
			$("div.setting").hide();
			$("div.download").show();
        });
        tip("设置成功！",function(){
            addon.port.emit("close");
        });
    });
    //page_folder li a dblclick
    $("#folder").delegate("li a","dblclick",function(){
        if(asHandlerStatus)
            return;
        $_li = $(this).parent();
        var dir = $_li.data("data");
        if($_li.hasClass("folder_add")){
            dir =  $("#title a:last-child").data("data");
            //createFolder
            asHandlerStatus = true;
            addon.port.emit("asHandler",JSON.stringify({
                method:"createFolder",
                data:{
                    docid:dir.docid,
                    name:"新建文件夹"
                }
            }));
        }else{
            fileList(dir,false);
        }
    });
    //page_folder li a click
    $("#folder").delegate("li a","click",function(){
        var $_li = $(this).parent();
        $("#folder li").removeClass("select");
        if($_li.hasClass("folder_add")){
            return;
        }
        $_li.addClass("select");
    });
    //page_folder li p dblclick
    $("#folder").delegate("li p","dblclick",function(){
        if(asHandlerStatus)
            return;
        var $_li = $(this).parent();
        if($_li.hasClass("folder_add")){
            return;
        }
        else{
            var dir = $_li.data("data")
            if(!dir.Canlist){
                tip(Folder_NO_Edit);
                return;
            }
            $_p = $(this);
            asHandlerStatus = true;
            addon.port.emit("asHandler",JSON.stringify({
                method:"permCheck",
                data:{
                    docid:dir.docid,
                    perm:16,
                    backMthod:"permCheck_P_db"
                }
            }));
        }
    });

    $("#folder").delegate("li p","keydown",function(e){
        if(asHandlerStatus)
            return;
        var value = $(this).text();
        if(e.which == 13 && value){
            $_p = $(this);
            var $_li = $_p.parent();
            var dir = $_li.data("data");
            asHandlerStatus = true;
            addon.port.emit("asHandler",JSON.stringify({
                method:"folderRename",
                data:{
                    docid:dir.docid,
                    name:value
                }
            }));
        }
    });
    function fileList(dir,istitle){
        if(dir.Canlist&&dir.docid){
            //getFileList
            asHandlerStatus = true;
            var data = {
                docid:dir.docid,
                backMthod:"getFileList"
            }
            if(istitle){
                data.backMthod = "getFileList_T";
            }
            addon.port.emit("asHandler",JSON.stringify({
                method:"getFileList",
                data:data
            }));
        }
        else if(dir.sublist.dirs.length > 0){
            var list = "";
            $.each(dir.sublist.dirs,function(index,subdir){
                list +="<li data-data='" + JSON.stringify(subdir) + "'>"
                    +"<a href='javascript:;'></a>"
                    +"<p>" + subdir.name +"</p></li>";
            });
            $("#folder").empty();
            $("#folder").append($(list));
            if(istitle){
                $_title_a.nextAll().remove();
            }
            else {
                var title = "<span>-></span><a href='javascript:;' data-data='"+ JSON.stringify(dir) + "'>" + dir.name + "</a>";
                $("#title").append($(title));
            }
        }
    }
    $("#title").delegate("a","click",function(){
        if(asHandlerStatus)
            return;
        $_title_a = $(this);
        if($(this).hasClass("root")){
            addon.port.emit("asHandler",JSON.stringify({
                method:"getEntryDoc",
                data:{
                    backMthod:"getEntryDoc_T"
                }
            }));
        }
        else{
            var dir = $(this).data("data");
            fileList(dir,true);
        }
    });

    //page_folder btn_ok click
    $("#btn_ok").click(function(){
        if(asHandlerStatus)
            return;
        $_li = $("#folder li.select");
        if($_li.length > 0) {
            var dir = $_li.data("data");
            if(dir.docid && dir.Canlist) {
                asHandlerStatus = true;
                addon.port.emit("asHandler",JSON.stringify({
                    method:"permCheck",
                    data:{
                        docid:dir.docid,
                        perm:16,
                        backMthod:"permCheck_OK"
                    }
                }));
            }
        }
    });
    function getAllDls(){
        addon.port.emit("selAllDownload");
    }
    addon.port.on("selAllDownloadBack",function(data){
        showDownload(data);
    });
    $("#download_list").delegate(".js_abandon","click",function(){
        if(confirm("是否确认放弃下载？")){
            var data = $(this).data("data");
            addon.port.emit("delDownload",JSON.stringify({
                url:data.url
            }));
            $(this).parents("li").remove();
        }
    });
    $("#download_list").delegate(".btn_fail","click",function(){
        var data = $(this).data("data");
        addon.port.emit("redownload",JSON.stringify({
            url:data.url,
            cookie:data.cookie
        }));
    });
    function showDownload(data){
        var data = JSON.parse(data);
        if(data && data.downloads && data.downloads.length > 0){
            //download_list
            var list = "";
            for(var i= 0;i< data.downloads.length; i++){
                var download = data.downloads[i];
				if(download.status == -1){
                    list +="<li><table><tr><td><img src='img/error.png'/></td>";
                    list +="<td><div><span class='name'style='color: #ff0000'>"
                    +download.name +"</span>"
                    +"<a href='javascript:;' data-data='" + JSON.stringify(download)
                    + "' class='btn_fail'>重试</a>";
                }
                else{
                    if(!download.download||download.download == 0){
                        list +="<li><table><tr><td><img src='img/wait.png'/></td>";
                    }
                    else if(download.download < 1 || download.upload < 1){
                        list +="<li><table><tr><td><img src='img/upload.gif' style='width: 24px;height: 24px'/></td>";
                    }
					else{
						list +="<li><table><tr><td><img src='img/ok.png' style='width: 24px;height: 24px'/></td>";
					}
                    list +="<td><div><span class='name'>"
                        +download.name +"</span>";
                }
				if(download.download < 1 || download.upload < 1){
					if(download.download < 1){
						list +='<div class="progress-bar"><div class="orange" style="width:'
						+ Math.floor(download.download * 100)+'%;"></div></div>';
					}
					else if(download.upload < 1){
						list +='<div class="progress-bar orange"><div class="green" style="width:'
							+ Math.floor(download.upload * 100)+'%;"></div></div>';
					}
					list +="</div></td>"
						 + "<td><a href='javascript:;' data-data='"+ JSON.stringify(download)
						 +"' class='js_abandon'><img src='img/close.png' /></a></td>"
						 +" </tr></table></li>";
				}              
            }
            $("#download_list").empty().append($(list));
        }
        else
            $("#download_list").empty().append("<li class='no_download'>暂无下载任务</li>");

    }
    var tip = function(str,callback){
        var oDiv = document.createElement('div');
        oDiv.setAttribute('style','position:fixed;z-index:9999;word-wrap: break-word;word-break:break-all;padding:10px 30px;background:rgba(0,0,0,.7);top:45%;color:#fff;font-size:18px;');
        oDiv.innerHTML = str;
        document.body.appendChild(oDiv);
        oDiv.style.left = (document.body.offsetWidth - oDiv.offsetWidth)/2 + 'px';
        setTimeout(function(){
            document.body.removeChild(oDiv);
            if(callback)
                callback();
        },1500);
    }
    /*
    //download open_webAS






    $("#download_list").delegate(".js_abandon","click",function(){
        if(confirm("是否确认放弃下载？")){
            var data = $(this).data("data");
            var userid = $.cookie("userid");
            delDownload(userid,data.url);
            $(this).parents("li").remove();
        }
    });
    $("#download_list").delegate(".btn_fail","click",function(){
        var data = $(this).data("data");
        background.redownload(data.url,data.cookie);
    });
    function onstorage(e){
        if(e){
            var userid = $.cookie("userid");
            if(e.key && userid == e.key){
                showDownload(e.newValue);
            }
            console.log(e.key + e.newValue)
        }

    }

    function init(){
        if(background.isLogin()){
            setUIInfo();
            getAllDls();
            $("div.login").hide();
            $("div.download").show();
        }
    }
    init();*/
});
