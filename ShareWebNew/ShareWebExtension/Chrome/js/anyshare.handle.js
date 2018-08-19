/**
 * Created by Administrator on 2015/7/23.
 */
//var service_host = "https://cmccloud.eisoo.com:31999/";
//var doc_host = "https://cmccloud.eisoo.com:31124/";
var default_save_path = "/个人文档/Web文件";
var Folder_NO_New = "对该文件夹没有新建文件夹权限";
var Folder_NO_Edit = "对该文件夹没有修改权限";
var Folder_NO_Delete = "对该文件夹没有删除权限";
var File_Upload_Fail ="文件上传失败";
var block = 2 * 1024 * 1024;

var encrypt = function (a) {
        var b = new RSAKey, c = "BB24BD0371A3141EE992761C574F1AA20010420C446144922C00F07EFB3C7520D81210A3C66DEC43B75A2370D01CD1F23E1BFC93B907201F5116F29A2C8149E2D2671313A0A78E455BBFC20B802BA1CBEE1EBBEDA50290F040F0FD4EBE89F24DB546EBB6B16579675551B9016A1A6FDCE6F6933901395453885CF55369ADB999";
        return b.setPublic(c, "10001"), hex2b64(b.encrypt(a)).replace(/(.{64})/g, function (a) {
            return a += "\n"
        });
    };

var convertDocs = function (docs){
    var dirs ={
        rootdirs:[]
    };
    docs.ForEach(function(i){
        var rootdir = {
            name:i.Key(),
            sublist:{
                dirs:[],
                files:[]
            }
        };
        $.each(i.source,function(index,j) {
            var dir = {
                Canlist : true,
                sublist: {
                    dirs: [],
                    files: []
                }
            };
            //文件夹
            if ("-1" == j.size) {
                var docname = j.docname;
                var docnames = docname.split("\\");
                if (docnames.length > 1) {
                    dir.name = docnames[0];
                    dir.Canlist = false;
                    for (var k = 1; k < docnames.length; k++) {
                        var subdir = {};
                        subdir.name = docnames[k];
                        subdir.size = j.size;
                        subdir.Canlist = false;
                        if (k == docnames.length - 1) {
                            subdir.Canlist = true;
                            subdir.docid = j.docid;
                            subdir.rev = j.otag;
                        }
                        var paresnt = dir;
                        while (paresnt.sublist && paresnt.sublist.dirs
                            && paresnt.sublist.dirs.length > 0) {
                            paresnt = paresnt.sublist.dirs[0];
                        }
                        paresnt.sublist.dirs.push(subdir);
                    }
                }
                else {
                    dir.name = docname;
                    dir.docid = j.docid;
                    dir.rev = j.otag;
                }
                rootdir.sublist.dirs.push(dir);
            }
            //文件
            else {
                var docname = j.docname;
                var docnames = docname.split("\\");
                if (docnames.length > 1) {
                    dir.name = docnames[0];
                    dir.Canlist = false;
                    for (var k = 1; k < docnames.Length; k++) {
                        if (k != docnames.length - 1) {
                            var subdir = {};
                            subdir.name = docnames[k];
                            subdir.size = "-1";
                            subdir.Canlist = false;
                            var paresnt = dir;
                            while (paresnt.sublist && paresnt.sublist.dirs
                                && paresnt.sublist.dirs.length > 0) {
                                paresnt = paresnt.sublist.dirs[0];
                            }
                            paresnt.sublist.dirs.push(subdir);
                        }
                        else {
                            var file = {};
                            file.docid = j.docid;
                            file.name = docnames[i];
                            file.size = j.size;
                            file.attr = j.attr;
                            file.client_mtime = j.client_mtime;
                            file.rev = j.otag;
                            var paresnt = dir;
                            while (paresnt.sublist && paresnt.sublist.dirs
                                && paresnt.sublist.dirs.length > 0) {
                                paresnt = paresnt.sublist.dirs[0];
                            }
                            paresnt.sublist.files.push(file);
                        }
                    }
                    rootdir.sublist.dirs.push(dir);
                }
                else {
                    var file = {};
                    file.docid = j.docid;
                    file.name = docname;
                    file.size = j.size;
                    file.attr = j.attr;
                    file.client_mtime = j.client_mtime;
                    file.rev = j.otag;
                    rootdir.sublist.files.push(file);
                }
            }
        });
        dirs.rootdirs.push(rootdir);

    });
    for (var i = 0; i < dirs.rootdirs.length; i++)
    {
        dirs.rootdirs[i].sublist.dirs = getdistinct(dirs.rootdirs[i].sublist.dirs);
    }
    return dirs;
}

var getdistinct =function (dirs){
    var result = [];
    var items = Enumerable.From(dirs).GroupBy(function(x){return x.name})
        .OrderBy(function(x){return x.Key()});
    items.ForEach(function(item){
        var dirs = item.source;
        if(dirs.length > 0){
            var dir = dirs[0];
            for (var i = 1; i < dirs.length; i++){
                dir.sublist.dirs.push(dirs[i].sublist.dirs);
                dir.sublist.files.push(dirs[i].sublist.files);
            }
            dir.sublist.dirs = getdistinct(dir.sublist.dirs);
            dir.sublist.files =  Enumerable.From(dir.sublist.files).Distinct()
                .OrderBy(function(x){return x.name;}).ToArray();
            result.push(dir);
        }
    });
    return result;
}

var anyshare_upload_file_asyn = function(url,fileStream,docid,filename,callback,progress){
    var fileSize = fileStream.size;
    var times = Math.max(Math.ceil(fileSize / block),1);
    var data = {
        client_mtime: new Date().getTime(),
        docid: docid,
        length: fileStream.size,
        more: false,
        name: filename,
        sn: 0,
        ondup:2//ondup	int	N	老版本服务器（20141206）不处理该字段，仅当name不为空时才会生效
        //0:默认值，不检查重名冲突
        //1:检查是否重命名，重名则抛异常
        //2:如果重名冲突，自动重名
        //3:如果重名冲突，自动覆盖
    }
    if(times == 1){
        anyshare_upload_asyn(url,fileStream,data,callback,function(event){
            if(progress){
                progress(event.loaded / event.total);
            }
        });
    }
    else{
        data.more = true;
        data.length = block;
        var part = fileStream.slice(0,block);
        anyshare_upload_asyn(url,part,data,function(upload){
            if(upload.status == 0 && upload.data
                && upload.data.docid && upload.data.rev){
                var count = 1;
                upload_rec(url,count,times,fileStream,upload.data.docid,upload.data.rev,callback,progress);
            }
            else{
                callback(upload);
            }
        },function(event){
            if(progress) {
                progress(event.loaded / fileSize);
            }
        });
    }
}
function upload_rec(url,count,times,fileStream,docid, rev,callback,progress){
    if(count > 0 && count < times){
        var start = count * block;
        var end = start + block;
        var fileSize = fileStream.size;
        var part = fileStream.slice(start,end);
        var data = {
            client_mtime: new Date().getTime(),
            docid: docid,
            length: part.size,
            more: count < times -1 ? true : false,
            sn: count,
            rev:rev
        }
        anyshare_upload_asyn(url,part,data,function(upload){
            if(upload.status == 0){
                count++;
                upload_rec(url,count,times,fileStream,docid, rev,callback,progress);
            }
            else {
                callback(upload);
            }

        },function(event){
            if(progress){
                progress((event.loaded +  start) / fileSize);
            }
        });
    }
    else if(count == times){
        var result = {status:0};
        callback(result);
    }
}
var anyshare_upload_asyn  = function(url,fileStream,data,callback, progress){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-1,
        errorMsg : File_Upload_Fail
    };
    var doc_host = localStorage.getItem("doc_host");
    if(userid && tokenid){
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        fd.append('file', fileStream);
        fd.append('json', JSON.stringify(data));
        var upload_url = doc_host + "v1/file?method=upload&userid=" + userid + "&tokenid=" + tokenid;
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function(){
            result.status = 0;
            result.data = $.parseJSON(xhr.responseText);
            result.errorMsg = "";
            callback(result);
            xhr = null;
        };
        xhr.onerror = function(){
            result.status = -1;
            if(xhr.responseText) {
                var err = $.parseJSON(xhr.responseText);
                result.errorMsg = err && err.errmsg ? err.errmsg : xhr.responseText;
            }
            result.errorMsg = xhr.statusText;
            callback(result);
            xhr = null;
        };
        /*xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    result.status = 0;
                    result.data = $.parseJSON(xhr.responseText);
                    result.errorMsg = "";
                    callback(result);
                }
                else {
                    result.status = -1;
                    var err = $.parseJSON(xhr.responseText);
                    result.errorMsg =  err&&err.errmsg ?err.errmsg : xhr.responseText;
                    callback(result);
                }
                xhr = null;
            }
        };*/
        xhr.onabort = function(){
            result.status = -1;
            result.errorMsg="用户放弃";
            callback(result);
        };
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable && progress ) {
                //var percentComplete = event.loaded / event.total;
                //console.log(percentComplete);
                progress(event);
                var userid = $.cookie("userid");
                if(!selDownload(userid,url)){
                    xhr.abort();
                }
            }
        };
        xhr.open("post", upload_url,true);
        xhr.send(fd);
    }
    //return result;
}

var anyshare_upload_file = function(fileStream,docid,filename,progress){
    var result ={
        status:-1,
        errorMsg : File_Upload_Fail
    }
    var fileSize = fileStream.size;
    var times = Math.max(Math.ceil(fileSize / block),1);
    var data = {
        client_mtime: new Date().getTime(),
        docid: docid,
        length: fileStream.size,
        more: false,
        name: filename,
        sn: 0,
        ondup:2//ondup	int	N	老版本服务器（20141206）不处理该字段，仅当name不为空时才会生效
        //0:默认值，不检查重名冲突
        //1:检查是否重命名，重名则抛异常
        //2:如果重名冲突，自动重名
        //3:如果重名冲突，自动覆盖
    }
    if(times == 1){
        var upload = anyshare_upload(fileStream,data,function(event){
            if(progress){
                progress(event.loaded / event.total);
            }
        });
        return upload;
    }
    else{
        data.more = true;
        data.length = block;
        var start = 0;
        var end = block;
        var part = fileStream.slice(start,end);
        var first = anyshare_upload(part,data,function(event){
            if(progress) {
                progress(event.loaded / fileSize);
            }
        });
        if(first.status == 0 && first.data
            && first.data.docid && first.data.rev){
            for(var i = 1; i < times; i++){
                start = end ;
                end = start + block;
                part = fileStream.slice(start,end);
                data.docid = first.data.docid;
                data.name = "";
                data.length = part.size;
                data.rev = first.data.rev;
                data.more = i < times -1 ? true : false;
                data.sn = i;
                var upload = anyshare_upload(part,data,function(event){
                    if(progress){
                        progress((event.loaded + i * block) / fileSize);
                    }
                });
                if(upload.status != 0){
                    return upload;
                }
            }
            result.status = 0;
            return result;
        }
        return first;
    }
}
var anyshare_upload = function(fileStream,data,progress){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-1,
        errorMsg : File_Upload_Fail
    };
    if(userid && tokenid){
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        fd.append('file', fileStream);
        fd.append('json', JSON.stringify(data));
        var doc_host = localStorage.getItem("doc_host");
        var url = doc_host + "v1/file?method=upload&userid=" + userid + "&tokenid=" + tokenid;
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    result.status = 0;
                    result.data = $.parseJSON(xhr.responseText);
                }
                else {
                    result.status = -1;
                    var err = $.parseJSON(xhr.responseText);
                    result.errorMsg =  err&&err.errmsg ?err.errmsg : xhr.responseText;
                }
                xhr = null;
            }
        };
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable && progress ) {
                //var percentComplete = event.loaded / event.total;
                //console.log(percentComplete);
                progress(event);
            }
        };
        xhr.open("post", url,false);
        xhr.send(fd);
    }
    return result;
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

var getSavePath = function(userid){
    /*var data = null;
    chrome.storage.sync.get(userid,function(items){
        if(items[userid]){
            data = items[userid].savePath;
        }
    });
    return data;*/
    var data = localStorage.getItem(userid);
    if(data){
        data = JSON.parse(data);
        return data.savePath;
    }
    return data;
}
var setSavePath = function(userid,path){
   /*chrome.storage.sync.get(userid,function(items){
        var data = items[userid] || {};
        data.savePath = path;
        chrome.storage.sync.set({userid:data});
    });*/

    var data = localStorage.getItem(userid);
    data = data ? JSON.parse(data) : {};
    data.savePath = path;
    localStorage.setItem(userid,JSON.stringify(data));
}
var addDownload = function(userid,url,name,cookie){
    var data = localStorage.getItem(userid);
    data = data ? JSON.parse(data) : {};
    data.downloads = data.downloads || [];
    if(data && data.downloads) {
        for (var i = 0; i < data.downloads.length; i++) {
            if (data.downloads[i].url == url) {
                return;
            }
        }
    }
    data.downloads.push(
        {
            name:name,
            url:url,
            cookie:cookie,
            status:0,//-1;fail,0:start,1:success
            download:0,
            upload:0
        }
    );
    localStorage.setItem(userid,JSON.stringify(data));
}
var selAllDownload = function(userid){
    var data = localStorage.getItem(userid);
    if(data){
        data = JSON.parse(data);
        if(data && data.downloads){
            return data.downloads;
        }
    }
    return null;
}
var selDownload = function(userid,url){
    var data = localStorage.getItem(userid);
    if(data){
        data = JSON.parse(data);
        if(data && data.downloads){
            for(var i=0;i< data.downloads.length;i++){
                if(data.downloads[i].url == url)
                    return data.downloads[i];
            }
        }
    }
    return null;
}
var editDownload = function(userid,url,status,name,download,upload){
    var data = localStorage.getItem(userid);
    if(data){
        data = JSON.parse(data);
        if(data && data.downloads){
            for(var i=0;i< data.downloads.length;i++){
                if(data.downloads[i].url == url){
                    data.downloads[i].name = name;
                    data.downloads[i].status = status;
                    data.downloads[i].download = download;
                    data.downloads[i].upload = upload;
                    localStorage.setItem(userid,JSON.stringify(data));
                    return;
                }
            }
        }
    }
}
var delDownload = function(userid,url){
    var data = localStorage.getItem(userid);
    if(data){
        data = JSON.parse(data);
        if(data && data.downloads){
            for(var i=0;i< data.downloads.length;i++){
                if(data.downloads[i].url == url){
                    data.downloads.splice(i,1);
                    localStorage.setItem(userid,JSON.stringify(data));
                    return;
                }
            }
        }
    }
}

var anyshare_ping = function (service_host,doc_host) {
    var result ={
        status:-2
    };
    $.ajax({
        type: "post",
        async: false,
        url: service_host + "/v1/ping",
        success: function (data) {
            result.authority = 0;
        },
        error: function (xhr, rs, error) {
            result.authority = -1;
            try{
                var err = $.parseJSON(xhr.responseText);
                result.authority_errorMsg = err.errmsg;
            }
            catch(e){
                result.authority_errorMsg =  xhr.responseText? xhr.responseText:xhr.statusText;
            }
        }
    });
    $.ajax({
        type: "post",
        async: false,
        url: doc_host + "/ping",
        success: function (data) {
            result.doc = 0;
        },
        error: function (xhr, rs, error) {
            result.authority = -1;
            try{
                var err = $.parseJSON(xhr.responseText);
                result.doc_errorMsg = err.errmsg;
            }
            catch(e){
                result.doc_errorMsg =  xhr.responseText? xhr.responseText:xhr.statusText;
            }
        }
    });
    if(result.authority == 0 && result.doc ==0) {
        result.status = 0;
        localStorage.setItem("service_host",service_host);
        localStorage.setItem("doc_host",doc_host);
    }
    else
        result.status = -1;
    return result;
}
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
            console.log(data);
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
                result.errorMsg =  xhr.responseText? xhr.responseText:xhr.statusText;
            }
        }
    });
    console.log(result);
    return result;
}

var anyshare_userInfo = function(){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-2
    };
    if(userid && tokenid){
        var service_host = localStorage.getItem("service_host");
        var url = service_host + "v1/user?method=get&userid=" + userid + "&tokenid=" + tokenid;
        result = ajax(result,url);
    }
    return result;
}

var anyshare_getEntryDoc = function(){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-2
    };
    if(userid && tokenid){
        var service_host = localStorage.getItem("service_host");
        var url = service_host + "v1/entrydoc?method=get&userid=" + userid + "&tokenid=" + tokenid;
        result = ajax(result,url,null,function (data,result) {
            data = $.parseJSON(data);
            var docs = Enumerable.From(data.docinfos).GroupBy(function (x) {
                return x.typename
            })
                .OrderBy(function (x) {
                    return x.Key()
                });
            docs = convertDocs(docs);
            result.data = docs;
            result.status = 0;
        });
    }
    return result;
}

var anyshare_getFileList = function(docid){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-2
    };
    if(userid && tokenid){
        var doc_host = localStorage.getItem("doc_host");
        var url = doc_host + "v1/dir?method=list&userid=" + userid + "&tokenid=" + tokenid;
        result = ajax(result,url,{docid:docid},function (data,result) {
            data = $.parseJSON(data);
            if (data.dirs && data.dirs.length > 0) {
                $.each(data.dirs, function (index, dir) {
                    dir.Canlist = true;
                    dir.sublist = {
                        dirs: [],
                        files: []
                    };
                });
            }
            result.data = data;
            result.status = 0;
        });
    }
    return result;
}

var anyshare_createFolder = function(docid,name){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result = anyshare_permCheck(docid,8);
    if(result.status == 0 && result.data.result == 0){
        if(userid && tokenid) {
            var doc_host = localStorage.getItem("doc_host");
            var url =doc_host + "v1/dir?method=create&userid=" + userid + "&tokenid=" + tokenid;
            result = ajax(result,url,{
                docid: docid,
                name: name,
                ondup: 2//0:默认值，不检查重名冲突  //1:检查是否重命名，重名则抛异常  //2:如果重名冲突，自动重名
                //3:如果重名冲突，自动覆盖
            },function (data,result) {
                data = $.parseJSON(data);
                data.Canlist = true;
                data.sublist = {
                    dirs: [],
                    files: []
                };
                result.data = data;
                result.status = 0;
            });
        }
    }
    else{
        result.status = -1;
        result.errorMsg = Folder_NO_New;
    }
    return result;
}

var anyshare_folderRename = function(docid,name){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result = anyshare_permCheck(docid,16);
    if(result.status == 0 && result.data.result == 0) {
        if (userid && tokenid) {
            var doc_host = localStorage.getItem("doc_host");
            var url = doc_host + "v1/dir?method=rename&userid=" + userid + "&tokenid=" + tokenid;
            result = ajax(result,url,{
                docid: docid,
                name: name,
                ondup:2
            });
        }
    }
    else{
        result.status = -1;
        result.errorMsg = Folder_NO_Edit;
    }
    return result;
}

var anyshare_folderDelete = function(docid){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result = anyshare_permCheck(docid,32);
    if(result.status == 0 && result.data.result == 0) {
        if (userid && tokenid) {
            var doc_host = localStorage.getItem("doc_host");
            var url = doc_host + "v1/dir?method=delete&userid=" + userid + "&tokenid=" + tokenid;
            result = ajax(result,url,{docid: docid});
        }
    }
    else{
        result.status = -1;
        result.errorMsg = Folder_NO_Delete;
    }
    return result;
}
//perm = 1,2,4,8,16,32
var anyshare_permCheck = function(docid,perm){
    var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-2
    };
    if(userid && tokenid){
        var service_host = localStorage.getItem("service_host");
        var url = service_host + "v1/perm1?method=check&userid=" + userid + "&tokenid=" + tokenid;
        result = ajax(result,url,{
            docid: docid,
            userid : userid,
            perm : perm
        });
    }
    return result;
}

var anyshare_webclient = function(){
	var userid =  $.cookie("userid");
    var tokenid = $.cookie("tokenid");
    var result ={
        status:-2
    };
    if(userid && tokenid){
        var service_host = localStorage.getItem("service_host");
        var url = service_host + "v1/redirect?method=gethostinfo&userid=" + userid + "&tokenid=" + tokenid;
        result = ajax(result,url);
    }
    return result;		
}
var anyshare_defaultSaveFolder = function(defaultSavePath) {
    var strs = array_trim(defaultSavePath.split(/[/\\]/));
    if (strs.length < 2) {
        return null;
    }
    var docs_result = anyshare_getEntryDoc();
    if (docs_result.status == 0 && docs_result.data) {
        var docs = docs_result.data;
        if (docs && docs.rootdirs && docs.rootdirs.length > 0) {
            for(var a = 0; a < docs.rootdirs.length; a++) {
                var rootdir = docs.rootdirs[a];
                if (rootdir.name == strs[0] && rootdir.sublist.dirs.length > 0) {
                    if (defaultSavePath == default_save_path) {
                        strs.splice(1, 0, rootdir.sublist.dirs[0].name);
                    }
                    for(var b = 0; b < rootdir.sublist.dirs.length; b++) {
                        var dir = rootdir.sublist.dirs[b];
                        if (dir.name == strs[1]) {
                            if (strs.length == 2) {
                                return dir;
                            }
                            var curDir = dir;
                            for (var j = 2; j < strs.length; j++) {
                                if (curDir.Canlist && curDir.docid) {
                                    var filelist_result = anyshare_getFileList(curDir.docid);
                                    if (filelist_result.status == 0 && filelist_result.data) {
                                        curDir.sublist = filelist_result.data;
                                        var f = Enumerable.From(curDir.sublist.dirs).Where(function (x) {
                                            return x.name == strs[j];
                                        }).FirstOrDefault(null);
                                        if (f != null) {
                                            curDir = f;
                                            continue;
                                        }
                                    }
                                    var cf_result = anyshare_createFolder(curDir.docid, strs[j]);
                                    if (cf_result.status == 0 && cf_result.data) {
                                        curDir.sublist.dirs.push(cf_result.data);
                                        curDir = cf_result.data;
                                    }
                                }
                                else if (curDir.sublist.dirs.Count > 0) {
                                    var f = Enumerable.From(curDir.sublist.dirs).Where(function (x) {
                                        return x.name == strs[j];
                                    }).FirstOrDefault(null);

                                    if (f != null) {
                                        curDir = f;
                                        continue;
                                    }
                                    var cf_result = anyshare_createFolder(curDir.docid, strs[j]);
                                    if (cf_result.status == 0 && cf_result.data) {
                                        curDir.sublist.dirs.push(cf_result.data);
                                        curDir = cf_result.data;
                                    }
                                }
                                else
                                    return null;
                            }
                            return curDir;
                        }
                    };
                }
            };
        }
    }
    return null;
}

var  array_trim = function(array){
    var result = [];
    if(array && array.length > 0){
        for(var i = 0; i< array.length; i++){
            if(array[i])
                result.push(array[i]);
        }
    }
    return result;
}

var ajax = function (result,url,args,success) {
    var option = {
        type: "post",
        async: false,
        url: url,
        success: function (data) {
            if(success){
                success(data,result);
            }
            else {
                data = $.parseJSON(data);
                result.data = data;
                result.status = 0;
            }
        },
        error: function (xhr, rs, error) {
            result.status = -1;
            var err = $.parseJSON(xhr.responseText);
            if(err&&"401001" == err.errcode ){
                var account = $.cookie("account");
                var password = $.cookie("password");
                if(account && password){
                    var login = anyshare_login(account,password,true,true);
                    if(result.status == 0){
                        ajax(result,url,args,success);
                    }
                }
            }
            else
                result.errorMsg = err&&err.errmsg ?err.errmsg : xhr.responseText;
        }
    };
    if(args){
        option.data = $.toJSON(args);
    }
    $.ajax(option);
    return result;
}