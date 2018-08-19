
let Plugin711 = document.getElementById('as-activex-plugin711');


if (!Plugin711) {
    try {
        Plugin711 = document.createElement('object')
        Plugin711.id = 'as-activex-plugin711'
        Plugin711.classid = 'clsid:{71F8D6B0-F626-40AB-B495-34FE87AC145E}'
        document.querySelector('head').appendChild(Plugin711)
    } catch (e) {

    }
}

/**
 * 检查是否有key
 */
export const SetDevProvride = (): string => {
    return Plugin711.SOF_CSP_AUTH_SetDevProvride('M&W eKeyXCSP V3:EETRUST_Contiainer|ExcelSecu CSP V5.0:EETRUST_Contiainer', 2);
}

/**
 * 是否认证成功
 * @param pin PIN码
 */
export const AuthLogin = (pin: string): string => {
    return Plugin711.SOF_CSP_AUTH_Login(pin, 2)
}

/**
 *  获取证书
 */
export const ExportUserCert = (): string => {
    return Plugin711.SOF_CSP_ExportUserCert(2);
}

/**
 * 数字签名
 * @param rand 随机数
 */
export const SignData = (rand: string): string => {
    return Plugin711.SOF_CSP_SignData(rand)
}

/**
 * 获取随机数
 */
export const authRandom = (randlong: number): number => {
    let rand = 0;
    for (let i = 1; i <= randlong; i++) {
        rand = rand * 10 + Math.random() * 10;
    }
    return rand;
}