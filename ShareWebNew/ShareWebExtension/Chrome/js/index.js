$(function () {
    var   background = chrome.extension.getBackgroundPage();
    $(".close a").click(function(){
        window.close();
    });
    $(".div_checkbox a").click(function () {
        var service_host = localStorage.getItem("service_host");
        var doc_host = localStorage.getItem("doc_host");
        if(service_host && doc_host) {
            service_host = service_host.substring(0,service_host.length-1);
            doc_host = doc_host.substring(0,doc_host.length-1);
            $("#host").val(service_host.substring(0,service_host.lastIndexOf(":")));
            $("#aPort").val(service_host.substring(service_host.lastIndexOf(":")+1));
            $("#dPort").val(doc_host.substring(doc_host.lastIndexOf(":")+1));
        }
        $("div.login").hide();
        $("div.service").show();
    });
    $("#btn_setService").click(function () {
        $(this).next(".error").text("").hide();
        var host = $("#host").val();
        var aPort = $("#aPort").val();
        var dPort = $("#dPort").val();
        if(!host) {
            $(this).next(".error").text("请填写服务器地址！").show();
            return;
        }
        if(!aPort) {
            $(this).next(".error").text("请填写应用端口！").show();
            return;
        }
        if(!dPort) {
            $(this).next(".error").text("请填写数据端口！").show();
            return;
        }
        var service_host = host + ":" + aPort +"/";
        var doc_host = host + ":" + dPort +"/";
        var result = anyshare_ping(service_host,doc_host);
        if(result.status == 0){
            $("div.login").show();
            $("div.service").hide();
        }
        else
            $(this).next(".error").text("服务连接失败，请确保服务器地址与端口正确，及网络正常！").show();
    });
    //login
    $("#login").click(function () {
        $(this).next(".error").text("").hide();
        var username = $("#username").val();
        var password = $("#password").val();
        if (!username) {
            $(this).next(".error").text("用户名不能为空！").show();
            return;
        }
        if (!password) {
            $(this).next(".error").text("密码不能为空！").show();
            return;
        }
        var login = anyshare_login(username,password,false,$("#checkbox").is(":checked"));
        if(login.status == 0){
            background.setLogin(true);
            setUIInfo();
            $("div.login").hide();
            $("div.download").show();
        }else
            $(this).next(".error").text(login.errorMsg).show();
    });
    function setUIInfo(){
        var userinfo = anyshare_userInfo();
        console.log(userinfo);
        if(userinfo.status == 0 && userinfo.data){
            $("#account_name").text(userinfo.data.name);
        }
        var userid = $.cookie("userid");
        $("#save_path_txt").val(getSavePath(userid));
    }

    //download open_webAS
    $("#open_webAS").click(function(){
        var url = "http://share.eisoocloud.com";
        var result = anyshare_webclient();
        if(result.status == 0 && result.data){
            var service_host = localStorage.getItem("service_host");
            if(service_host && service_host.indexOf("https") === 0){
                url = "https://" + result.data.host + ":" + result.data.https_port;
            }
            else
                url = "http://" + result.data.host + ":" + result.data.port;
        }
        chrome.tabs.create({url:url},
            function(){}
        );
    });
    //download setting
    $("#setting").click(function(){
        $(".page").width(560);
        $("div.download").hide();
        $("div.setting").show();
    });

    //setting logout
    $("#logout").click(function(){
        $.cookie("account",null,{expires:-1});
        $.cookie("password",null,{expires:-1});
        $("div.setting").hide();
        $(".page").width(360);
        $("div.login").show();
        background.setLogin(false);
    });

    // //setting browse
    $("#browse").click(function(){
        var entryDoc = anyshare_getEntryDoc();
        if(entryDoc.status==0&&entryDoc.data){
            var list ="";
            $.each(entryDoc.data.rootdirs,function(index,dir){
                list += "<li data-data='" + $.toJSON(dir) + "'>"
                    +"<a href='javascript:;'></a>"
                    +"<p>" + dir.name +"</p></li>";
            });
            $("#folder").empty().append($(list));
            $("#page_login").hide();
            $("#page_folder").show();
        }
        else{
            tip(entryDoc.errorMsg);
        }
    });

    // setting st_complete
    $("#st_complete").click(function(){
        var userid = $.cookie("userid");
        setSavePath(userid,$("#save_path_txt").val());
        tip("设置成功！",function(){
            window.close();
        });
    });


    //page_folder li a dblclick
    $("#folder").delegate("li a","dblclick",function(){
        var $_li = $(this).parent();
        var dir = $_li.data("data");
        if($_li.hasClass("folder_add")){
            dir =  $("#title a:last-child").data("data");
            var newFolder = anyshare_createFolder(dir.docid,"新建文件夹");
            if(newFolder.status == 0 && newFolder.data){
                dir.sublist.dirs.push(newFolder.data);
                $_li.data("data", $.toJSON(dir));
                var li ="<li data-data='" + $.toJSON(newFolder.data) + "'>"
                    +"<a href='javascript:;'></a>"
                    +"<p>" + newFolder.data.name +"</p></li>";
                $_li.after($(li));
                $_li.next().find("a").trigger("click");
            }
            else{
                tip(newFolder.errorMsg);
            }
        }else{
            fileList(dir);
        }
    });
    function fileList(dir){
        if(dir.Canlist&&dir.docid){
            var sublist = anyshare_getFileList(dir.docid);
            if(sublist.status == 0 && sublist.data){
                var list = "<li class='folder_add'>"
                    +"<a href='javascript:;'></a>"
                    +"<p>新建文件夹</p></li>";
                if(sublist.data.dirs.length > 0){
                    $.each(sublist.data.dirs,function(index,subdir){
                        list +="<li data-data='" + $.toJSON(subdir) + "'>"
                            +"<a href='javascript:;'></a>"
                            +"<p>" + subdir.name +"</p></li>";
                    });
                }
                $("#folder").empty().append($(list));
                $("#title").append("<span>-></span><a href='javascript:;' data-data='"
                    +$.toJSON(dir) +"'>" + dir.name +"</a>");
                return true;
            }
            else{
                tip(sublist.errorMsg);
                return false;
            }
        }
        else if(dir.sublist.dirs.length > 0){
            var list = "";
            $.each(dir.sublist.dirs,function(index,subdir){
                list +="<li data-data='" + $.toJSON(subdir) + "'>"
                    +"<a href='javascript:;'></a>"
                    +"<p>" + subdir.name +"</p></li>";
            });
            $("#folder").empty();
            $("#folder").append($(list));
            $("#title").append("<span>-></span><a href='javascript:;' data-data='"
                +$.toJSON(dir) +"'>" + dir.name +"</a>");
            return true;
        }
        return false;
    }

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
        var $_li = $(this).parent();
        if($_li.hasClass("folder_add")){
            return;
        }else{
            var dir = $_li.data("data")
            if(!dir.Canlist){
                tip(Folder_NO_Edit);
                return;
            }
            var result = anyshare_permCheck(dir.docid, 16);
            if (result.status == 0 && result.data.result == 0) {
                $(this).attr("contenteditable",true);
                $(this).blur(function(){
                    var dir = $_li.data("data");
                    var value = $(this).text();
                    if(dir.name != value){
                        $(this).text(dir.name);
                    }
                    $(this).attr("contenteditable",false);
                });
            }
            else{
                tip(Folder_NO_Edit);
            }
        }
    });
    $("#folder").delegate("li p","keydown",function(e){
        var value = $(this).text();
        if(e.which == 13 && value){
            var $_li = $(this).parent();
            var dir = $_li.data("data");
            var result = anyshare_folderRename(dir.docid,value);
            if(result.status == 0){
                if(result.data) {
                    $(this).text(result.data.name);
                    dir.name = result.data.name;
                }else{
                    dir.name = value;
                }
                $_li.data("data", dir);
                $(this).attr("contenteditable",false);
            }
        }
    });

    $("#title").delegate("a","click",function(){
        if($(this).hasClass("root")){
            var entryDoc = anyshare_getEntryDoc();
            if(entryDoc.status == 0 && entryDoc.data){
                var list ="";
                $.each(entryDoc.data.rootdirs,function(index,dir){
                    list += "<li data-data='" + $.toJSON(dir) + "'>"
                        +"<a href='javascript:;'></a>"
                        +"<p>" + dir.name +"</p></li>";
                });
                $("#folder").empty().append($(list));
                $(this).nextAll().remove();
            }
            else{
                tip(entryDoc.errorMsg);
            }
        }
        else{
            var dir = $(this).data("data");
            if(fileList(dir)){
                $(this).nextAll().remove();
            }
        }
    });
    //page_folder btn_ok click
    $("#btn_ok").click(function(){
        var $_li = $("#folder li.select");
        if($_li.length > 0) {
            var dir = $_li.data("data");
            if(dir.docid && dir.Canlist) {
                var result = anyshare_permCheck(dir.docid, 16);
                if (result.status == 0 && result.data.result == 0) {
                    var path = "";
                    $.each($("#title a"), function (index, item) {
                        if (!$(item).hasClass("root")) {
                            path += "/" + $(item).text();
                        }
                    });
                    path += "/" + $_li.find("p").text();
                    $("#save_path_txt").val(path);
                    $("#page_folder").hide();
                    $("#page_login").show();
                }
                else {
                    tip(Folder_NO_Edit);
                }
            }
        }
    });

    //page_folder btn_cancle click
    $("#btn_cancle").click(function(){
        window.close();
    });

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
    function onstorage(e){
        if(e){
            var userid = $.cookie("userid");
            if(e.key && userid == e.key){
                showDownload(e.newValue);
            }
            console.log(e.key + e.newValue)
        }

    }
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
    function getAllDls(){
        var userid = $.cookie("userid");
        var data = localStorage.getItem(userid);
        showDownload(data);
        window.addEventListener("storage", onstorage, false);
    }
    function init(){
        if(background.isLogin()){
            setUIInfo();
            getAllDls();
            $("div.login").hide();
            $("div.service").hide();
            $("div.download").show();
        }
        else if(background.getServices()){
            $("div.login").show();
            $("div.service").hide();
        }
    }
    init();
});
