const path = require('path')
const http = require('http')
const fetch = require('node-fetch')

module.exports = async function ({ protocol, params: { package } }, res) {

    const basename = path.basename(package)
    const ext = path.extname(package)

    // 客户端类型: WIN_32 = 0, WIN_64 = 1, android = 2, mac = 3, WIN_32_ADVANCED = 4, WIN_64_ADVANCED = 5
    let osType;

    switch (ext) {
        case '.exe':
            if (basename.includes('x64')) {
                if (basename.includes('fm')) {
                    osType = 5
                } else {
                    osType = 1
                }
            }
            else if (basename.includes('x86')) {
                if (basename.includes('fm')) {
                    osType = 4
                } else {
                    osType = 0
                }
            }
            break

        case '.apk':
            osType = 2
            break

        case '.dmg':
            osType = 3
            break
    }

    if (osType || osType === 0) {
        const usehttps = protocol === 'https'

        try {
            const { host: reqhost, } = await fetch(`http://127.0.0.1:9998/v1/redirect?method=gethostinfo`, {
                method: 'POST',
            }).then(body => body.json())
            const ret = await fetch(`http://127.0.0.1:9998/v1/update?method=download`, {
                method: 'POST',
                body: JSON.stringify({ usehttps, reqhost, osType })
            })
            const result = await ret.json()

            if (ret.status >= 400) {
                res.status(ret.status)
                res.send(result)
            } else {
                res.redirect(result.URL)
            }
        } catch (ex) {
            res.send(ex)
        }
    } else {
        res.status(404)
        res.send(null)
    }
}