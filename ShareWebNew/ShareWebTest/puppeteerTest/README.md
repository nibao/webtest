

# ShareWebTest

基于puppeteer的AnyShare端到端（E2E）测试。

## 依赖库
- [puppeteer](https://github.com/GoogleChrome/puppeteer) Chrome团队推出的headless browser
- [mocha](https://github.com/mochajs/mocha) 测试框架
- [chai](https://github.com/chaijs/chai) 支持TDD 和 BDD 风格的断言库
- [faker.js](https://github.com/Marak/Faker.js) 用于生成各种模拟数据
- [lodash](https://github.com/lodash/lodash) JavaScript函数库，提供一些相互独立的实用的函数
- [chalk](https://github.com/chalk/chalk) 命令行输出美化库
- [Resemble.js](https://github.com/HuddleEng/Resemble.js) 图像分析和对比的库
- [mysql](https://github.com/mysqljs/mysql) node-mysql，使用node封装的对mysql的操作

## 项目结构

![](http://ow67vzejn.bkt.clouddn.com/18-6-14/9664384.jpg)


## 安装

在项目根目录下执行以下命名，忽略Chromium下载并安装所有依赖

```
$ yarn config set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD "true"
$ yarn install 
```

## 写测试

在*tests*目录下建立任意命名格式的js文件，将被作为测试用例执行。

一个简单的测试用例：

```
const Selector={
    // 将Selector写到函数最外层顶部，方便共用和维护
}

describe('测试用例集合名，如登录页',()=>{
	// 定义变量保存Browser和Page实例，一般保存Page实例就可以了，Brwoser实例在测试用例本身中一般不会用到
	let browser,
        page
    
    before(async () => { // 通过before 钩子，初始化页面
        browser = await browserPromise() // 获取到Browser实例，并保存到外层的browser变量上
        page = await browser.newPage() // 获取到Page实例，并保存到外层的page变量上
        await page.setViewport({ // 设置页面宽高
            width: 1366,
            height: 768,
        })
        await page.goto(server.client) // 跳转到指定url的页面
        await page.waitFor(SELECTOR.aboutSelector) // 通过判断某个元素出现（一般判断底部元素）来断言页面加载完成（这种方式不是很可靠）
    })

    after(async () => { // 通过after 钩子，在所有测试完成后关闭页面
        await page.close()
    })
    
    describe('UI',()=>{
        it('通过page实例提供的API对页面进行操作',async ()=>{
            await page.waitFor('title')
            const title = await page.title()
            expect(title).to.equal('爱数 AnyShare')
        })
    })
    
    
    it('其他的不好分类的，也可以单独写出来，不做嵌套，具体参考Mocha的测试套件用法',()=>{
        
    })
})
```

## 配置

- 所有外部配置(非Puppeteer自身的配置)，都通过*config.json*文件进行配置

```json
{
    "server": {
        "client": "http://192.168.138.28:80", // 客户端访问地址
        "console": "http://192.168.138.28:8000", // 控制台访问地址
        "cluster": "http://192.168.138.28:8080" // 集群访问地址
    },
    "db": {
        "host": "192.168.138.28", // 数据库IP
        "user": "Anyshare", // 数据库用户名
        "password": "asAlqlTkWU0zqfxrLTed", //数据库密码
        "port": 3320 //数据库端口
    },
    "clientUser": [{
        "username": "test", // 客户端用户名
        "password": "eisoo.com" // 客户端密码
    }],
    "consoleUser": [{
        "username": "admin", // 控制台用户名
        "password": "eisoo.com" //控制台密码
    }],
    "screenshotPath": "C:\\Users\\admin\\Desktop\\tmp", // 截图保存目录，指定任意目录，如果目录不存在将自动生成
    "chromeExecutablePath":"C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe" // Chrome指定文件的路径
}
```

- Puppeteer自身的配置通过*browserPromise.js*中进行配置，具体参考[官方文档关于Puppeteer的配置](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerdefaultargs)

## 启动

在根目录下执行以下命令将启动测试进行执行

- `yarn test-dev`

  调试模式，相比无头模式，有以下特性：

  - Chrome将以界面模式运行
  - 操作延时（slowMo）为100ms
  - 打开devtool

- `yarn test`

  无头模式，用于持续集成。

> - 如果想对命令进行配置，修改package.json文件中的scripts配置即可。
> - 如果相对puppeteer进行配置，如重新指定Chrome安装位置或重新指定操作延时等，在browserPromise.js文件中defaultOpts进行修改。

## 截图保存与对比

- 保存截图

  puppeteer的截图API需要完整的指定截图保存路径和文件名，因此封装了创建截图目录的方法，用法查看`util/path.js`中的`createScreenshotDir`函数注释。

- 图像对比

  目前截图对比在第三方库Resemblejs的基础上进行的封装，具体封装API的使用查看`util/imgDiff.js`中导出的函数注释。

  截图对比依赖手动指定baseline，默认会对比截图保存目录下baseline目录中的同名文件，如果没有找到原文件和基准图像将对应给出错误提示。

一个完整的示例：

```js
const screenshotDir = createScreenshotDir(path.basename(__dirname)) //path.basename() 方法返回一个 path的最后一部分 __dirname返回当前模块所在的路径，path.basename(__dirname)便能取到当前模块所处的文件夹的名称，createScreenshotDir函数将在config.json中指定的截图保存目录下创建同名文件夹并返回文件夹路径

it('登录页截图', async () => {
    await page.waitFor(SELECTOR.aboutSelector)
    await page.screenshot({
        path: `${screenshotDir}/fullpage.png` //保存截图到上面获取到的截图目录中
    })

    const {
        misMatchPercentage
    } = await getDiff(screenshotDir, 'fullpage.png') //对比截图目录中的指定图像，返回对比结果

    expect(misMatchPercentage * 1).to.be.at.most(0.1, '图像差异大于阈值10%，请检查') //断言对比结果不超过10%
})
```

## Debug

- 使用`console.log()` 调试

- 使用VS-Code的node调试工具：【调试】-【添加配置】，配置信息参考：

  ```json
  {
      // 使用 IntelliSense 了解相关属性。 
      // 悬停以查看现有属性的描述。
      // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
      "version": "0.2.0",
      "configurations": [
          {
              "type": "node",
              "request": "launch",
              "name": "Puppeteer Mocha test",
              "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
              "args": [
                  "${workspaceFolder}/bootstrap.js",
                  "${workspaceFolder}/tests"
                  "--no-timeouts",
                  "--colors",
                  "--recursive",
              ],
              "internalConsoleOptions": "openOnSessionStart"
          },
      ]
  }
  ```

  然后F5就可以启动调试，建议使用这种方式进行调试。

## 相关参考

  - [confluence Web测试相关文档](http://confluence.eisoo.com/pages/viewpage.action?pageId=3968808)
  - [confluence 自动化测试相关文档](http://confluence.eisoo.com/pages/viewpage.action?pageId=3968383)



## Troubleshooting

- puppeteer安装缓慢？

  puppeteer安装的时候默认会下载最新版的Chromium(~170Mb Mac, ~282Mb Linux, ~280Mb Win) ，鉴于国内的网络环境，耗时较长建议跳过安装。

  通过环境变量的方式：

  ```shell
  $ env PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" yarn add puppeteer
  ```

  或者设置npm config的方式：

  ```shell
  $ yarn config set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD "true"
  $ yarn add puppeteer
  ```

  [Environment variables](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#environment-variables)

  或者简单忽略intall.js脚本的执行：

  ```
  $ yarn add puppeteer --ignore-scripts
  ```

  然后在使用的时候指定Chrome的执行路径

  ```js
  puppeteer.launch({
      headless:false,
      executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  })
  ```

- 启动puppeteer报错

  错误信息：UnhandledPromiseRejectionWarning: Error: Protocol error (Page.getFrameTree): 'Page.g
  etFrameTree' wasn't found undefined

  ![](http://ow67vzejn.bkt.clouddn.com/18-3-27/51229198.jpg)

  **issue**:https://github.com/GoogleChrome/puppeteer/issues/1681

- 使用Async Await报错

  使用Async Await的语法需要node v7.6版本以上，因此如果node版本低于v7.6原生是不支持的，可以升级node到v7.6以上版本。

- puppeteer headless模式默认语言为en-us

  headless模式下，puppeteer使用的Chrome为en-us，而界面模式则会跟随操作系统。可以通过在`page.launch({args: ['--lang=zh-cn,zh']})` 设置默认语言为zh-cn

  参考：https://stackoverflow.com/questions/46908636/how-to-specify-browser-language-in-puppeteer

- Dom更新后通过保存的ElementHandle获取Dom节点信息时节点信息未更新

  ElementHandle相当于节点的快照，而不是引用。因此如果要获取最新的Dom节点信息，必须在dom更新后再重新获取。

  ```javascript
  const elementHandleOld = page.$('.elment-selector')
  elementHandleOldText = page.evalute(el=>el.innerText,elementHandleOld) // 'old innerText'

  buttonHandle.click() // 点击之后ElementHandleOld的元素内容改变

  console.log(page.evalute(el=>el.innerText,elementHandleOld)) // 'old innerText',使用原来的句柄，仍然返回句柄定义时的Dom节点信息

  let elementHandleNew = page.$('.elment-selector') // 获取新的句柄
  console.log(page.evalute(el=>el.innerText,elementHandleOld)) // 'new innerText'，获取到新的Dom节点信息

  /*另外两种获取最新的Dom节点信息的方式*/
  console.log(page.$eval('.elment-selector',el=>el.innerText)) // 'new innerText'
  console.log(page.evaluate(()=>document.querySelector('.elment-selector').innerText)) // 'new innerText'
  ```

- ​文件上传
  Puppeteer支持单个文件或文件夹，无法同时上传多个文件或文件夹。使用时注意路径，尽量使用绝对路径，如果传入相对路径则会以程序进程所在路径进行绝对路径的计算，可以使用`process.cwd()`查看当前的进程所在路径。
  ```javascript
  // upload example
  const fileInputHandle = page.$('input[type="file"]') // 获取上传按钮句柄
  fileInputHandle.uploadFile(require('path').resolve(__dirname,'source/test.png')) // 传入文件的绝对路径上传文件
  ```
  **tips：** ElementHandle.uploadFile() 这个API resolve的时候并不代表文件已经上传完成，关于文件是否上传完成需要自行判断。

  ​


