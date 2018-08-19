window.AsConfig = function () {
    try {
        var recip = (new Function('return ' + window.g_CC.sPr))()
        return {
            host: 'http://wdy.crec.cn',
            appid: 'eisoo',
            key: '76637081-9388-463c-9a48-9a2237e7ee70',
            account: recip._sa,
            baseUrl: 'as'
        }
    } catch (e) {
        alert('Owa 环境错误')
    }
}