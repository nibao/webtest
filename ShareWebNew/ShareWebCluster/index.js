const express = require('express');
const _ = require('lodash');
const fetch = require('node-fetch');
const http = require('http');
const csrf = require('csurf');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const thrift = require('thrift');
const signinProxy = require('./handlers/signin');
const logout = require('./handlers/logout');
const multerUtil = require('./handlers/multerutil')
const clientupload = require('./handlers/clientupload')
const serverupload = require('./handlers/serverupload')
const tpoupload = require('./handlers/tpoupload')

const app = express();
app.use(session({
    secret: 'eisoo', // 用来对session id相关的cookie进行签名
    name: 'clustersid',
    store: new FileStore({
        path: '/tmp', // session文件存储路径，因服务器升级过程中会替换sysvol目录导致session丢失，故调整到tmp目录下
        ttl: 60 * 60 * 24, // 会话时间，单位：秒
        reapInterval: 60 * 60 * 24 // 设置清除过期会话的间隔，单位：秒
    }), // 本地存储session（文本文件）
    saveUninitialized: false, // 是否自动保存未初始化的会话
    resave: true, // 是否每次都重新保存会话
    httpOnly: true
}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.apache.thrift.json'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.options('*', cors());

app.post('/interface/signin', signinProxy)

app.post('/interface/logout', logout)

/**
 * 以下接口不需要检查权限
 */
PostWhiteList = [
    'Licensem_GetDeviceInfo',
    'Usrm_Login',
    'Usrm_GetUserInfo',
    'get_version',
    'Log',
    'get_app_master_node_ip',
    'GetSiteInfo',
    'verify_sign_in',
    'Usrm_GetVcodeConfig',
    'signin',
    'GetHostName',
    'Usrm_CreateVcodeInfo'
];

/**
 * 验证当前用户本地sid和session是否一致
 * @param {*} request 
 */
const verify = function (request) {
    const [firstArg, methodName, ...last] = _.values(request.body)

    if (!PostWhiteList.some(method => method === methodName)) {
        return 'user' in request.session
    } else {
        return true
    }
}

app.post('/api/:module', async (req, res) => {
    let response;

    if (!verify(req)) {
        res.status(403).send(JSON.stringify(null));
    } else {
        try {
            // 由于记录日志接口Log没有返回值，故取消await操作，直接返回null值
            if (req.params.module === 'EACPLog' && req.body[1] === 'Log') {
                fetch(`http://${req.headers['x-tclient-addr']}:18008/${req.params.module}`, {
                    timeout: 0,
                    method: 'POST',
                    body: JSON.stringify(req.body)
                })
                response = null;
            } else {
                const result = await fetch(`http://${req.headers['x-tclient-addr']}:18008/${req.params.module}`, {
                    timeout: 0,
                    method: 'POST',
                    body: JSON.stringify(req.body)
                })

                res.status(result.status);
                // thrift协议将 {"i64": -1} 构造成  {"i64": -00000001}， 导致浏览器client使用JSON.parse()解析时报错
                response = eval(await result.text());
            }
        } catch (ex) {
            res.status(500)
            response = ex;
        } finally {
            res.set('Content-Type', 'application/vnd.apache.thrift.json');
            res.send(JSON.stringify(response))
        }
    }
})

/**
 * 上传客户端升级包
 */
app.post('/interface/upload/clientupload/', multerUtil.any(), clientupload)

/**
 * 上传服务器升级包
 */
app.post('/interface/upload/serverupload/', multerUtil.any(), serverupload)

/**
 * 第三方选件上传
 */
app.post('/interface/thirdpartyoptions/upload/', multerUtil.any(), tpoupload)

const server = http.createServer(app);

server.timeout = 0;
server.listen(18080);