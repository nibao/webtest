/**
 * /home路由跳转
 * @param {*} param0 请求
 * @param {*} response 响应
 */
module.exports = async function ({ path, query: { userid, tokenid, lang, platform }, params: { view } }, response) {
    switch (view) {
        case 'groupdoc':
            response.redirect(`/login?redirect=${encodeURIComponent('/home/documents/all')}&userid=${userid}&tokenid=${tokenid}&platform=${platform}&lang=${lang}`)
            break

        default:
            response.redirect(`/login?redirect=${encodeURIComponent('/home/documents/all')}&userid=${userid}&tokenid=${tokenid}&platform=${platform}&lang=${lang}`)
    }
}