import { checkWatermark as checkDirWatermark } from '../apis/efshttp/dir/dir'
import { checkWatermark as checkLinkWatermark } from '../apis/efshttp/link/link'
import { get as getUser } from '../apis/eachttp/user/user';

/**
 * 水印工厂函数
 * @param doc 
 */
export const watermarkFactory: Core.Watermark.WatermarkFactory = async function (doc) {

    const { link, usrdisplayname, usrloginname } = doc

    /**
     * 获取水印类型，水印配置
     * 如果传入的是文件，取上一级docid
     */
    const { watermarktype: watermarkType, watermarkconfig: watermarkConfig } = await (link ? checkLinkWatermark(doc) : checkDirWatermark(doc))

    const { user = {}, image = {}, text = {} } = JSON.parse(watermarkConfig)

    /**
     * 是否启用预览水印
     */
    const previewWatermarkEnabled = (watermarkType & 1) === 1 && (user.enabled || image.enabled || text.enabled)

    /**
     * 用户名
     */
    let name = '', account = ''

    if (previewWatermarkEnabled && user.enabled) {
        const userInfo = link ? { name: usrdisplayname, account: usrloginname } : (await getUser())

        /** 
         * 限制只显示50个字符
         */
        name = userInfo.name.slice(0, 50)
        account = userInfo.account.slice(0, 50)
    }

    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D,
        element = new Image()

    if (image.enabled && image.src) {
        element.src = image.src
        element.crossOrigin = 'Anonymous'
    }

    const watermark = ({ zoom = 1, type = 'canvas' } = {}) => {

        /**
         * 水印旋转角度
         */
        const theta = Math.PI / 6

        /**
         * 水印边距
         */
        const paddingX = 80 * zoom
        const paddingY = 50 * zoom

        if (previewWatermarkEnabled) {

            /**
             * 测量文本长宽
             * @param content 
             * @param fontSize 
             */
            const measureText = (content, fontSize) => {
                const font = `${fontSize * zoom}px simsun`
                ctx.font = font
                return {
                    content,
                    font,
                    width: ctx.measureText(content).width,
                    height: fontSize * zoom
                }
            }

            /**
             * 提取水印信息
             */
            const infos = [
                { ...image, element, width: element.width * image.scale / 100 * zoom, height: element.height * image.scale / 100 * zoom },
                { ...text, ...measureText(text.content, text.fontSize) },
                { ...user, ...measureText(name, user.fontSize) },
                { ...user, ...measureText(account, user.fontSize) }
            ].filter(info => info.enabled && (info.src || info.content))

            /**
             * 计算单块水印大小
             */
            const contentWidth = Math.max(...infos.map(info => info.width)),
                contentHeight = infos.reduce((sum, info) => sum + info.height, 0)

            /**
             * 设置canvas大小
             */
            canvas.width = contentWidth * Math.abs(Math.cos(theta)) + contentHeight * Math.abs(Math.sin(theta)) + paddingX * 2
            canvas.height = contentWidth * Math.abs(Math.sin(theta)) + contentHeight * Math.abs(Math.cos(theta)) + paddingY * 2

            /**
             * 移动到canvas中心
             */
            ctx.translate(canvas.width / 2, canvas.height / 2)


            /**
             * 水印倾斜theta角度
             */
            ctx.rotate(-theta)

            /**
             * 移动到水印开始位置
             */
            ctx.translate(-contentWidth / 2, -contentHeight / 2)

            /**
             * 绘制水印
             */
            infos.reduce((offsetY, info) => {
                if (typeof info.content === 'string') {
                    ctx.fillStyle = info.color
                    ctx.textBaseline = 'hanging'
                    ctx.globalAlpha = info.transparency / 100
                    ctx.font = info.font
                    ctx.fillText(info.content, (contentWidth - info.width) / 2, offsetY)
                } else {
                    ctx.globalAlpha = info.transparency / 100
                    ctx.scale(info.scale / 100 * zoom, info.scale / 100 * zoom)
                    ctx.drawImage(info.element, (contentWidth - info.width) / (info.scale / 100 * zoom) / 2, offsetY)
                    ctx.scale(100 / (info.scale * zoom), 100 / (info.scale * zoom))
                }
                return offsetY + info.height
            }, 0)

            return { src: type === 'base64' ? canvas.toDataURL() : canvas, layout: user.layout || 0 }
        }

        return null
    }

    /**
     * 如果包含图片水印，等待图片加载完成
     */
    if (image.enabled && image.src) {
        await new Promise(resolve => { element.onload = resolve })
    }

    return watermark
}