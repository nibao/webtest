const thrift = require('thrift');
const path = require('path')
const fs = require('fs');
const util = require('util');
const ShareMgnt = require('../gen-node/ncTShareMgnt');


/**
 * 第三方插件上传
 */
const thirdPartyOptionsUpload = async function (req, res) {
    const [file] = req.files
    // 客户端升级包路径
    const filepath = path.resolve(__dirname, file.path)
    // 上传的插件包


    const connection = thrift.createConnection(req.headers['x-tclient-addr'], 9600)
    const transport = new thrift.TBufferedTransport(connection)
    const protocol = new thrift.TJSONProtocol(transport)
    const client = thrift.createClient(ShareMgnt, connection)
    let response

    try {

        const content = await run(filepath, res)
        // 调用添加单个授权文件的接口
        const ret = await client.NLPIRAuthm_AddAuthFile(file.originalname, content)
        response = null
    } catch (ex) {
        res.set('Content-Type', 'application/vnd.apache.thrift.json');
        res.status(500)
        response = ex
    } finally {
        // // 删除插件包
        fs.unlinkSync(filepath)
        fs.rmdirSync(file.destination)

        // 为了解决跨域上传问题
        res.set('Access-Control-Allow-Origin', req.headers['origin']);
        res.send(JSON.stringify(response))
    }
}



async function run(filePath, res) {
    const readFile = util.promisify(fs.readFile);
    const fr = await readFile(filePath);
    return fr;
}

//导出对象
module.exports = thirdPartyOptionsUpload;