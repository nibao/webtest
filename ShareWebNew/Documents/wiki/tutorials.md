# 开放组件使用文档
## 兼容性
开放组件只支持IE8+及现代浏览器，文档预览组件只支持IE9+。

## 依赖
* 开放组件依赖部分ES6的API，因此需要确保在页面中引入`es6-shim`、`es6-sham`库文件。
* IE8还需要`es5-shim`、`es5-sham`库。
* 部分组件还需要依赖特定的库文件支持，需要自行引入。

## 导入
* 使用&lt;link&gt;标签模块导入 `anyshare.desktop.css` 或 `anyshare.mobile.css`。  
* 使用&lt;script&gt;标签或者AMD／CMD模块系统导入 `anyshare.desktop.js` 或 `anyshare.mobile.js`。  
* 组件使用前要求进行实例化，如下：
```js
    <script src="/sdk/anyshare.desktop.css"></script>
    <script src="/sdk/anyshare.desktop.js"></script>
    
    window.AnyShare = AnyShare({
        // ...实例化参数对象
    })
```

实例化参数如下：
* `locale` 组件的语言设置，支持`zh-cn`、`zh-tw`、 `en-us`，默认为 `en-us`。
* `host` 服务器地址
* `EACPPort` 权限控制服务端口
* `EFSPPort` 文档访问控制端口
* `userid` 用户id信息，组件内调用开放API时需要传递给服务端，可以接受`string`或`Function`，如果传递函数，则每次调用开放API前会执行此函数，并将返回值作为鉴权使用的userid。
* `tokenid` 用户token信息，组件内调用开放API时需要传递给服务端，可以接受`string`或`Function`，如果传递函数，则每次调用开放API前会执行此函数，并将返回值作为鉴权使用的tokenid。

实例化完成后，即可以开始正式使用开放组件。

## 使用
开放组件`实例对象`的结构示例如下：

```js
    // AnyShare顶级对象，即实例化对象
    AnyShare {
        // 核心方法
        Core {
            // 登录接口
            login: Function;

            // 第三方登录
            thirdLogin: Function;
        };

        // Web组件
        Components {
            // 预览组件
            Preview: Function;
        }
    }
```

Components实例化时接受2个参数，第一个参数为组件配置参数，第二个参数为渲染的容器DOM节点。

使用示例：

```js
    // 使用预览组件
    // 调用组件后会返回一个销毁函数，调用该函数将注销组件并从容器中完全移除。
    const destroy = AnyShare.Components.Preview({ 
            // ...初始化参数
        }, document.querySelector('#preview'));

    // 销毁
    destroy()
```


组件内部的某些操作也会触发组件自身的销毁，可以在初始化参数中传递一个 `beforeDestroy()` 函数，组件进入销毁过程前会先调用此函数，如果在该函数中返回`false`，则不会执行销毁动作。

```js
    // 使用预览组件
    // 调用组件后会返回一个销毁函数，调用该函数将注销组件并从容器中完全移除。
    const destroy = AnyShare.Components.Preview({ 
            beforeDestroy: () => false // 永远不会销毁
        }, document.querySelector('#preview'));

    destroy() // 因为beforeDestroy总是返回false，所以组件永远不会销毁
```