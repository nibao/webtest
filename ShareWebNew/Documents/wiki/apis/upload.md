# 预览组件
## 依赖
* WebUploader [http://fex.baidu.com/webuploader/](http://fex.baidu.com/webuploader/)

## 使用
```javascript
    AnyShare.Components.Upload(props, dom)
```

### props
* ［可选］link   
外链对象，必须包含有效密码

* ［可选］dest
上传目标目录

* [可选] uploadSuccess
回调函数，当文件上传完成时触发

* [可选] swf
Flash插件路径，IE8、IE9上传文件需要插入flash上传插件，并且需要浏览器支持flash