/**
 * /jumping路由跳转
 * @param {*} param0 请求
 * @param {*} response 响应
 */
module.exports = async function ({ path, query: { action, target, userid, tokenid, lang, platform } }, response) {
    let nextUrl;

    switch (action) {
        case 'search':
            response.redirect(`/login?redirect=${encodeURIComponent('/home/search')}&userid=${userid}&tokenid=${tokenid}&platform=${platform}&lang=${lang}`)
            break

        case 'login':
            response.redirect(`/login?redirect=${encodeURIComponent('/home/documents/all')}&userid=${userid}&tokenid=${tokenid}&platform=${platform}&lang=${lang}`)
            break

        default:
            response.send(404)

        case 'redirect':
            switch (target) {
                case 'recycle':
                    response.redirect(`/login?redirect=${encodeURIComponent('/home/documents/recycle')}&userid=${userid}&tokenid=${tokenid}&platform=${platform}&lang=${lang}`)
                    break

                default:
                    response.redirect(`/login?redirect=${encodeURIComponent('/home/documents/all')}&userid=${userid}&tokenid=${tokenid}&platform=${platform}&lang=${lang}`)
                    break
            }
    }
}