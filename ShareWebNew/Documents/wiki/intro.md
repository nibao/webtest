# 开放组件
## 使用场景
### OpenAPI
想要使用AnyShare的OpenAPI接口进行网盘应用开发，可是开放API太底层了，使用起来总不是很方便，好不容易Chrome下调用接口成功了，IE8上又遇到跨域问题，半天都没有解决。   
使用AnyShare Web开放组件，一条语句解决问题：  
`AnyShare.Core.API.Auth1.getNew()`

### 多终端整合
AnyShare Web开发完了外链分享功能，iOS和Android终端却因为项目紧张迟迟没有进行开发。  
使用AnyShare Web开放组件，一条语句解决问题：  
`AnyShare.Components.LinkShare()`

### 基础组件
第三方厂商想要拿到AnyShare的目录结构，把业务系统内的文件同步到AnyShare.  
使用AnyShare Web开放组件，一条语句解决问题：  
`AnyShare.Components.DocsGrid()`

### 高级组件
客户已经使用了一段时间AnyShare Web，可是每次上传文件都要登录，选择指定目录进行上传，太不方便了。  
使用AnyShare Web开放组件，一条语句解决问题：  
`AnyShare.Components.Upload()`

