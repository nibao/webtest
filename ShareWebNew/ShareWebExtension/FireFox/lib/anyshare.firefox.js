/**
 * Created by wxj on 2015/9/21.
 */
const { Cc,Ci } = require("chrome");
const { XMLHttpRequest, forceAllowThirdPartyCookie } = require("sdk/net/xhr");
const localStorage = require("sdk/simple-storage").storage;
//const service_host = "https://cmccloud.eisoo.com:31999/";
//const doc_host = "https://cmccloud.eisoo.com:31124/";
const default_save_path = "/个人文档/Web文件";
const Folder_NO_New = "对该文件夹没有新建文件夹权限";
const Folder_NO_Edit = "对该文件夹没有修改权限";
const Folder_NO_Delete = "对该文件夹没有删除权限";
const File_Upload_Fail ="文件上传失败";
const block = 2 * 1024 * 1024;
var Request = require("sdk/request").Request;
var Enumerable =  require("./linq.js").Enumerable;
var encrypt = require("./rsa.js").encrypt;
var g_account ,g_password;

var asHandler ={
    convertDocs:function (docs){
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
            for(var index in i.source){
                var j = i.source[index];
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
            };
            dirs.rootdirs.push(rootdir);

        });
        for (var i = 0; i < dirs.rootdirs.length; i++)
        {
            dirs.rootdirs[i].sublist.dirs = asHandler.getdistinct(dirs.rootdirs[i].sublist.dirs);
        }
        return dirs;
    },
    getdistinct:function (dirs){
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
                dir.sublist.dirs = asHandler.getdistinct(dir.sublist.dirs);
                dir.sublist.files =  Enumerable.From(dir.sublist.files).Distinct()
                    .OrderBy(function(x){return x.name;}).ToArray();
                result.push(dir);
            }
        });
        return result;
    },
    anyshare_ping:function (service_host,doc_host,callback) {
        Request({
            url: service_host + "/v1/ping",
            onComplete: function (response) {
                var result ={
                    status:-1
                };
                if(response.status == 200){
                    Request({
                        url: doc_host + "/ping",
                        onComplete: function (response) {
                            var result ={
                                status:-1
                            };
                            if(response.status == 200){
                                result.status = 0;
                                storage.setServiceHost(service_host);
                                storage.setDocHost(doc_host);
                                callback(result);
                            }
                            else{
                                if(response.json){
                                    result.errorMsg = response.json.errmsg;
                                }
                                else
                                    result.errorMsg = response.text?response.text:response.statusText;
                                callback(result);
                            }
                        }
                    }).post();
                }
                else{
                    if(response.json){
                        result.errorMsg = response.json.errmsg;
                    }
                    else
                        result.errorMsg = response.text?response.text:response.statusText;
                    callback(result);
                }
            }
        }).post();
    },
    anyshare_login:function(account,password,encrypted,callback){
        password = encrypted ? password : encrypt(password);
        var service_host = storage.getServiceHost();
        Request({
            url: service_host + "v1/auth1?method=getnew",			
            content:JSON.stringify({
                account: account,
                password: password
            }),
            onComplete: function (response) {
                var result ={
                    status:-1
                };				
                console.log("anyshare_login:onComplete:status" + response.status
                    +"data:"+ response.statusText );
                if(response.status == 200){
                    g_account = account;
                    g_password = password;
                    result.data = response.json;
                    result.save = encrypted;
                    result.pwd = password;
                    result.account = account;
                    result.status = 0;
                }
                else{
                    if(response.json){
                        result.errorMsg = response.json.errmsg;
                    }
                    else
                        result.errorMsg = response.text?response.text:response.statusText;
                }
                callback(result);
            }
        }).post();
    },
    anyshare_userInfo:function(userid,tokenid,callback){
        var service_host = storage.getServiceHost();
        var url = service_host + "v1/user?method=get&userid=" + userid + "&tokenid=" + tokenid;
        ppRequest(url,callback);
    },
    anyshare_getEntryDoc:function(userid,tokenid,callback){
        var service_host = storage.getServiceHost();
        var  url = service_host + "v1/entrydoc?method=get&userid=" + userid + "&tokenid=" + tokenid;
        ppRequest(url,callback,null,function (response,result) {
            var data = response.json;
            var docs = Enumerable.From(data.docinfos).GroupBy(function (x) {
                return x.typename
            })
                .OrderBy(function (x) {
                    return x.Key()
                });
            docs = asHandler.convertDocs(docs);
            result.data = docs;
            result.status = 0;
        });
    },

    anyshare_getFileList : function(userid,tokenid,docid,callback){
        var doc_host = storage.getDocHost();
        var url = doc_host + "v1/dir?method=list&userid=" + userid + "&tokenid=" + tokenid;
        ppRequest(url,callback,{
            docid: docid
        },function (response,result) {
            var data = response.json;
            if (data.dirs && data.dirs.length > 0) {
                for(var index in data.dirs){
                    var dir = data.dirs[index];
                    dir.Canlist = true;
                    dir.sublist = {
                        dirs: [],
                        files: []
                    };
                }
            }
            result.data = data;
            result.status = 0;
        });
    },
    anyshare_permCheck : function(userid,tokenid,docid,perm,callback){
        var service_host = storage.getServiceHost();
        var url = service_host + "v1/perm1?method=check&userid=" + userid + "&tokenid=" + tokenid;
        ppRequest(url,callback,{
            docid: docid,
            userid : userid,
            perm : perm
        });
    },
    anyshare_createFolder : function(userid,tokenid,docid,name,callback) {
        asHandler.anyshare_permCheck(userid, tokenid, docid, 8, function (result) {
            if (result.status == 0 && result.data.result == 0) {
                var doc_host = storage.getDocHost();
                var url = doc_host + "v1/dir?method=create&userid=" + userid + "&tokenid=" + tokenid;
                ppRequest(url,callback,{
                    docid: docid,
                    name: name,
                    ondup: 2//0:默认值，不检查重名冲突  //1:检查是否重命名，重名则抛异常  //2:如果重名冲突，自动重名
                    //3:如果重名冲突，自动覆盖
                },function (response,result) {
                    var data = response.json;
                    data.Canlist = true;
                    data.sublist = {
                        dirs: [],
                        files: []
                    };
                    result.data = data;
                    result.status = 0;
                });
            }
            else{
                result.status = -1;
                result.errorMsg = Folder_NO_New;
                callback(result);
            }
        });
    },
    anyshare_folderRename : function(userid,tokenid,docid,name,callback) {
        asHandler.anyshare_permCheck(userid, tokenid, docid, 16, function (result) {
            if (result.status == 0 && result.data.result == 0) {
                var doc_host = storage.getDocHost();
                var url = doc_host + "v1/dir?method=rename&userid=" + userid + "&tokenid=" + tokenid;
                ppRequest(url,callback,{
                    docid: docid,
                    name: name,
                    ondup: 2//0:默认值，不检查重名冲突  //1:检查是否重命名，重名则抛异常  //2:如果重名冲突，自动重名
                    //3:如果重名冲突，自动覆盖
                },function (response,result) {
                    result.data = response.json;
                    if(result.data||result.data.name){
                        result.data.name = name;
                    }
                    result.status = 0;
                });
            }
            else {
                result.status = -1;
                result.errorMsg = Folder_NO_Edit;
                callback(result);
            }
        });
    },
    anyshare_webclient : function(userid,tokenid,callback){
        var service_host = storage.getServiceHost();
        var  url = service_host + "v1/redirect?method=gethostinfo&userid=" + userid + "&tokenid=" + tokenid;
        ppRequest(url,callback,null,function (response,result) {
            result.data = response.json;
            result.service_host = service_host;
            result.status = 0;
        });
    },
    array_trim : function(array){
        var result = [];
        if(array && array.length > 0){
            for(var i = 0; i< array.length; i++){
                if(array[i])
                    result.push(array[i]);
            }
        }
        return result;
    },
    anyshare_getPath_rec:function(userid,tokenid,dir,strs,index,count,callback){
        if(index >= count){
            callback(dir);
            return;
        }
        if(dir && dir.Canlist && dir.docid){
            asHandler.anyshare_getFileList(userid,tokenid,dir.docid,function(filelist_result){
                console.log(filelist_result.data);
              if (filelist_result.status == 0 && filelist_result.data){
                  dir.sublist = filelist_result.data;
                  var f = Enumerable.From(dir.sublist.dirs).Where(function (x) {
                      return x.name == strs[index];
                  }).FirstOrDefault(null);
                  if (f != null) {
                      dir = f;
                      index ++;
                      asHandler.anyshare_getPath_rec(userid,tokenid,dir,strs,index,count,callback);
                  }
                  else{
                      asHandler.anyshare_createFolder(userid,tokenid,dir.docid,strs[index],function(cf_result){
                          if (cf_result.status == 0 && cf_result.data) {
                              dir.sublist.dirs.push(cf_result.data);
                              dir = cf_result.data;
                              index ++;
                              asHandler.anyshare_getPath_rec(userid,tokenid,dir,strs,index,count,callback);
                          }
                          else{
                              callback(null);
                              return;
                          }
                      })
                  }
              }else
                  callback(null);
          });
        }
        else if (dir.sublist.dirs.Count > 0){
            var f = Enumerable.From(dir.sublist.dirs).Where(function (x) {
                return x.name == strs[index];
            }).FirstOrDefault(null);
            if (f != null) {
                dir = f;
                index ++;
                asHandler.anyshare_getPath_rec(userid,tokenid,dir,strs,index,count,callback);
            }
            else{
                asHandler.anyshare_createFolder(userid,tokenid,dir.docid,strs[index],function(cf_result){
                    if (cf_result.status == 0 && cf_result.data) {
                        dir.sublist.dirs.push(cf_result.data);
                        dir = cf_result.data;
                        index ++;
                        asHandler.anyshare_getPath_rec(userid,tokenid,dir,strs,index,count,callback);
                    }
                    else{
                        callback(null);
                        return;
                    }
                })
            }
        }
        else
            callback(null);
    },
    anyshare_defaultSaveFolder : function(userid,tokenid,defaultSavePath,callback) {
        var strs = asHandler.array_trim(defaultSavePath.split(/[/\\]/));
        if (strs.length < 2) {
            callback(null);
            return;
        }
        asHandler.anyshare_getEntryDoc(userid,tokenid,function(docs_result){
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
                                    j=2;
                                    console.log(j + dir.name);
                                    asHandler.anyshare_getPath_rec(userid,tokenid,dir,strs,j,strs.length,callback);
                                    return;
                                }
                            };
                        }
                    };
                }
            }
        });
        callback(null);
    },

    anyshare_upload_asyn :function(userid,tokenid, url,fileStream,data,callback, progress){
        var result ={
            status:-1,
            errorMsg : File_Upload_Fail
        };
        if(userid && tokenid){
            var xhr = new XMLHttpRequest();
            var fd = Cc['@mozilla.org/files/formdata;1'].createInstance(Ci.nsIDOMFormData);
            fd.append('file', fileStream);
            fd.append('json', JSON.stringify(data));
            var doc_host = storage.getDocHost();
            var upload_url = doc_host + "v1/file?method=upload&userid=" + userid + "&tokenid=" + tokenid;
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function(){
                result.status = 0;
                result.data = JSON.parse(xhr.responseText);
                result.errorMsg = "";
                callback(result);
                xhr = null;
            };
            xhr.onerror = function(){
                result.status = -1;
                try{
                    var err = JSON.parse(xhr.responseText);
                    result.errorMsg = err.errmsg;
                }
                catch(e) {
                    result.errorMsg = xhr.responseText || xhr.statusText;
                }
                callback(result);
                xhr = null;
            };
            xhr.onabort = function(){
                result.status = -1;
                result.errorMsg="用户放弃";
                callback(result);
            };
            xhr.upload.onprogress = function(event) {
                if (event.lengthComputable && progress ) {
                    progress(event);
                    if(!storage.selDownload(userid,url)){
                        xhr.abort();
                    }
                }
            };
            xhr.open("post", upload_url,true);
            forceAllowThirdPartyCookie(xhr);
            xhr.send(fd);
        }
    },
    upload_rec:function (userid,tokenid,url,count,times,fileStream,docid, rev,callback,progress){
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
            asHandler.anyshare_upload_asyn(userid,tokenid,url,part,data,function(upload){
                if(upload.status == 0){
                    count++;
                    asHandler.upload_rec(userid,tokenid,url,count,times,fileStream,docid, rev,callback,progress);
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
    },
    anyshare_upload_file_asyn : function(userid,tokenid,url,fileStream,docid,filename,callback,progress){
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
            asHandler.anyshare_upload_asyn(userid,tokenid,url,fileStream,data,callback,function(event){
                if(progress){
                    progress(event.loaded / event.total);
                }
            });
        }
        else{
            data.more = true;
            data.length = block;
            var part = fileStream.slice(0,block);
            asHandler.anyshare_upload_asyn(userid,tokenid,url,part,data,function(upload){
                if(upload.status == 0 && upload.data
                    && upload.data.docid && upload.data.rev){
                    var count = 1;
                    asHandler.upload_rec(userid,tokenid,url,count,times,fileStream,upload.data.docid,upload.data.rev,callback,progress);
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
}

var storage ={
    getSavePath : function(userid){
        var data = localStorage.userid;
        if(data){
            data = JSON.parse(data);
            if(data&&data.savePath)
                return data.savePath;
        }
        return default_save_path;
    },
    setSavePath : function(userid,path){
        var data = localStorage.userid;
        data = data ? JSON.parse(data) : {};
        data.savePath = path;
        localStorage.userid = JSON.stringify(data);
    },
    addDownload: function(userid,url,name,cookie){
        var data = localStorage.userid;
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
        localStorage.userid = JSON.stringify(data);
    },
    selAllDownload : function(userid){
        var data = localStorage.userid;
        if(data){
            data = JSON.parse(data);
            if(data && data.downloads){
                return data.downloads;
            }
        }
        return null;
    },
    selDownload : function(userid,url){
        var data = localStorage.userid;
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
    },
    editDownload : function(userid,url,status,name,download,upload){
        var data = localStorage.userid;
        if(data){
            data = JSON.parse(data);
            if(data && data.downloads){
                for(var i=0;i< data.downloads.length;i++){
                    if(data.downloads[i].url == url){
                        data.downloads[i].name = name;
                        data.downloads[i].status = status;
                        data.downloads[i].download = download;
                        data.downloads[i].upload = upload;
                        localStorage.userid = JSON.stringify(data);
                        return;
                    }
                }
            }
        }
    },
    delDownload : function(userid,url){
        var data = localStorage.userid;
        if(data){
            data = JSON.parse(data);
            if(data && data.downloads){
                for(var i=0;i< data.downloads.length;i++){
                    if(data.downloads[i].url == url){
                        data.downloads.splice(i,1);
                        localStorage.userid = JSON.stringify(data);
                        return;
                    }
                }
            }
        }
    },
    setServiceHost:function (service_host) {
        localStorage.service_host = service_host;
    },
    getServiceHost:function () {
        return localStorage.service_host;
    },
    setDocHost:function (doc_host) {
        localStorage.doc_host = doc_host;
    },
    getDocHost:function () {
        return localStorage.doc_host;
    }
}
var ppRequest = function (url,callback,data,success) {
    var option = {
        url: url,
        onComplete: function (response) {
            console.log( url+":onComplete:status" + response.status +"data:"+ response.text);
            var result ={
                status:-1
            };            
            if(response.status == 200){
                if(success){
                    success(response,result);
                }
                else {
                    result.data = response.json;
                    result.status = 0;
                }
            }
            else{
                if(response.json){
                    if("401001" == response.json.errcode && g_account && g_password){
                        asHandler.anyshare_login(g_account,g_password,true,function (result) {
                            if(result.status == 0){
                                ppRequest(url,callback,data,success);
                            }
                            else
                                callback(result);
                        });
                        return;
                    }
                    result.errorMsg = response.json.errmsg;
                }
                else
                    result.errorMsg = response.text?response.text:response.statusText;
            }
            callback(result);
        }
    };
    if(data)
        option.content = JSON.stringify(data);
    Request(option).post();
}
exports.asHandler = asHandler;
exports.storage = storage;