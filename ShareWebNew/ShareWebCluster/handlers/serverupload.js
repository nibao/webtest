const thrift = require('thrift');
const path = require('path')
const fs = require('fs');
const ECMSUpgrade = require('../gen-node/ncTECMSUpgradeManager')

/**
 * 服务器升级包上传
 */
const serverUpload = async function (req, res) {
    // 上传的服务器升级包
    const [file] = req.files
    // 服务器升级包路径
    const filepath = path.resolve(__dirname, file.path)

    const connection = thrift.createConnection(req.headers['x-tclient-addr'], 9203)
    const transport = new thrift.TBufferedTransport(connection)
    const protocol = new thrift.TJSONProtocol(transport)
    const client = thrift.createClient(ECMSUpgrade, connection)

    connection.on('error', error => {
        try {
            // 删除升级包
            fs.unlinkSync(filepath)
            fs.rmdirSync(file.destination)
        }
        catch (err) {
        }

        res.send(JSON.stringify(error))
    })

    let response

    try {
        // 调用上传服务器升级包的接口
        const ret = await client.import_package(filepath)
        response = null
    } catch (ex) {
        res.set('Content-Type', 'application/vnd.apache.thrift.json');
        res.status(500)
        response = ex
    } finally {
        // 关闭连接
        connection.end()

        try {
            // 删除升级包
            fs.unlinkSync(filepath)
            fs.rmdirSync(file.destination)
        }
        catch (err) {
        }

        res.send(JSON.stringify(response))
    }
}

//导出对象
module.exports = serverUpload;