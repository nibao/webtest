import * as React from 'react'
import { noop, assign, pick, includes } from 'lodash';
import { metaData } from '../../core/apis/efshttp/file/file'
import { docname } from '../../core/docs/docs'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getOEMConfig, getConfig } from '../../core/config/config';
import { previewOSS } from '../../core/preview/preview';
import { buildCADHref, PreviewType } from '../../core/cadpreview/cadpreview'
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { getHostInfo } from '../../core/apis/eachttp/redirect/redirect';
import { userAgent } from '../../util/browser/browser'
import { envLanguage } from '../../util/browser/browser'

function* uniqueId(prefix = '') {
    let i = 0;
    while (true) {
        yield `${prefix}${i}`;
        i++;
    }
}

const CADPreviewId = uniqueId('CADPreview_')

export default class CADPreviewBase extends React.Component<Components.CADPreview.Props, Components.CADPreview.State> {

    static defaultProps = {
        fullScreen: false,

        skipPermissionCheck: false,

        onRequestFullScreen: noop,

        onCADPreviewError: noop
    }

    state = {
        theme: 'dark',

        showBottomTool: false,

        previewType: PreviewType.Loading
    }

    id = CADPreviewId.next().value

    timer: number;

    flashVars: string = ''

    browserType: number | undefined;   // 浏览器类型

    flashLoadingDone: boolean = false   // flash插件是否加载完成

    swfUrl: string = '/libs/webcad/cadViewer.swf' // swf路径

    resUrl: string = '';    // 转码后的ocf文件url

    cadurl: string = '';

    waterUrl: string = '';  // 水印url

    gstarcadwebviewUrl: string = '' // 大图插件需要用到的url

    gstarCADWebViewerSetup86Url: string = '/download/GstarCADWebViewerSetup-x86.msi'  // 32位大图插件下载地址

    gstarCADWebViewerSetup64Url: string = '/download/GstarCADWebViewerSetup-x64.msi'  // 64位大图插件下载地址

    previewid: string = ''  // 转码后的文件版本号

    usehttps: boolean = false

    reqhost: string = ''

    size: number = 0  // 文件的大小

    async componentWillMount() {
        // 获取文件大小（权限审核预览的文档对象doc.size不存在，通过metadata接口获取）
        if (this.props.doc.size !== undefined) {
            this.size = this.props.doc.size
        } else {
            const { size } = await metaData({ docid: this.props.doc.docid })
            this.size = size
        }

        if (this.size < 80 * 1024 * 1024) {
            // flash插件的onProgress必须要注册在window上
            window[`${this.id}OnProgress`] = (nPos, nSize, stage) => {
                return this.progressHandler(nPos, nSize, stage)
            }

            // flash插件的onLoaded必须要注册在window上
            window[`${this.id}OnLoaded`] = (nPos, nSize, stage) => {
                const url = `${this.cadurl}/hccadtransform`
                const urlData = `{\"transformPage\":\"${url}\"}`
                this.movie('WebCAD').setDataUrl('urlData', urlData)
            }

            this.initCADData()
        } else {
            this.setState({
                previewType: PreviewType.TooLarge
            })
        }
    }

    componentWillReceiveProps({ fullScreen }) {
        // 切换全屏和非全屏时，cad图会偏移，调用“显示全图”
        if (fullScreen !== this.props.fullScreen) {
            setTimeout(() => {
                this.zoomAll()
            }, 300)
        }
    }

    componentWillUnmount() {
        if (this.size < 80 * 1024 * 1024) {
            // ie8，执行delete window[xxx]会报错
            try {
                delete window[`${this.id}OnProgress`]
                delete window[`${this.id}OnLoaded`]
            }
            catch (e) {
                window[`${this.id}OnProgress`] = undefined
                window[`${this.id}OnLoaded`] = undefined
            }
        }
    }

    /**
     * 获取文件resUrl和水印waterUrl
     */
    async initCADData() {
        this.waterUrl = await buildCADHref(this.props.link, window.screen.width, window.screen.height, this.id, this.props.doc)
        this.fetchOCF()
    }

    /**
     * 获取转码后的ocf文件
     */
    async fetchOCF() {
        const { link, doc, illegalContentQuarantine } = this.props;

        try {
            const { url, previewid } = await previewOSS(assign({ illegalContentQuarantine }, pick(link, ['link', 'password']), pick(doc, ['docid', 'rev'])))

            this.resUrl = url
            this.previewid = previewid

            const [https, { host }] = await Promise.all([getConfig('https'), getHostInfo(null)])

            this.usehttps = https ? true : false
            this.reqhost = host

            // 当获取到resUrl之后再去预览
            this.previewCADFile()
        }
        catch ({ errcode }) {
            switch (errcode) {
                // 正在转码，两秒后再重新获取
                case ErrorCode.DocumentConverting:
                    setTimeout(() => {
                        this.fetchOCF()
                    }, 2000);
                    break;

                // 转码失败
                case ErrorCode.PreviewFormatInvalid:
                default:
                    this.props.onCADPreviewError(errcode)
            }
        }
    }

    /**
     * 预览文件
     * 文件大小超过sizeLimit，使用大图插件预览
     * 文件大小小于sizeLimit，使用flash插件预览（小图预览）
     */
    private async previewCADFile() {
        this.cadurl = await getOEMConfig('cadurl')

        // 获取sizeLimit, 如果获取不到，设置为10MB
        let sizeLimit;
        try {
            sizeLimit = await getConfig('cad_plugin_threshold')
        }
        catch (err) {
            sizeLimit = 10 * 1024 * 1024
        }

        if (this.size > sizeLimit) {
            // 文件大小超过sizeLimit，使用大图插件预览
            let resUrlObj;

            if (this.props.link && this.props.link.link) {
                // 外链预览
                resUrlObj = {
                    link: this.props.link.link,
                    password: this.props.link.password,
                    usehttps: this.usehttps,
                    reqhost: this.reqhost
                }
            } else {
                // 非外链预览
                const { userid, tokenid } = getOpenAPIConfig(['userid', 'tokenid']);
                resUrlObj = {
                    usehttps: this.usehttps,
                    reqhost: this.reqhost,
                    userid,
                    tokenid
                }
            }

            this.gstarcadwebviewUrl = `gstarcadwebview://${this.cadurl.replace('http://', '')}?ssl=off&fileId=${this.previewid}&fileName=.dwg&layout=&extData=${btoa(JSON.stringify(resUrlObj))}`

            this.setState({
                previewType: PreviewType.LargeFilePreview
            })
        } else {
            // 文件大小小于sizeLimit，使用flash插件预览（小图预览）
            // 获取浏览器类型
            const { app } = userAgent()
            this.browserType = app

            // 获取语言环境（有可能是zh_cn这种格式的）
            let lan = envLanguage().replace('_', '-')

            if (!includes(['zh-cn', 'zh-tw', 'en-us'], lan)) {
                // 如果 lan不属于'zh-cn', 'zh-tw', 'en-us'中的任意一种，则默认为'en-us'
                lan = 'en-us'
            }

            const resUrlObj = {
                'resurl': this.resUrl,
                'waterurl': this.waterUrl
            }

            // 构造flashVars数据
            this.flashVars = `showToolBar=0&runmode=0&languagePage=/libs/webcad/${lan}.xml&lan=${lan}&OnProgressEvent=${this.id}OnProgress&OnLoadedEvent=${this.id}OnLoaded&fileId=${this.previewid}&fileName=.dwg&layout=&extData=${btoa(JSON.stringify(resUrlObj))}`

            this.setState({
                previewType: PreviewType.SmallFilePreview
            })
        }
    }

    /**
     * 给flash插件传数据
     */
    private setFlashData() {
        if (this.movie('WebCAD') && this.movie('WebCAD').setData) {
            this.movie('WebCAD').setData(this.resUrl, this.waterUrl)
        } else {
            setTimeout(() => {
                this.setFlashData()
            }, 1000)
        }
    }

    /**
     * 进度处理函数
     */
    private progressHandler(nPos: number, nSize: number, stage: number): boolean {
        if (stage === 0 && nPos === nSize) {
            // flash插件已加载完成
            this.flashLoadingDone = true
        }

        return true
    }

    /**
     * 获取[movieName]
     */
    private movie(movieName: string) {
        if (navigator.appName.indexOf('Microsoft') !== -1) {
            return window[movieName];
        } else {
            return document[movieName];
        }
    }

    /**
     * 选择
     */
    protected choose() {
        this.movie('WebCAD').executeCommand('')
    }

    /**
     * 拖动视图
     */
    protected drag() {
        this.movie('WebCAD').executeCommand('DRAG')
    }

    /**
     * 放大
     */
    protected zoomOut() {
        this.movie('WebCAD').executeCommand('ZOOMOUT')
    }

    /**
     * 缩小
     */
    protected zoomIn() {
        this.movie('WebCAD').executeCommand('ZOOMIN')
    }

    /**
     * 显示全图
     */
    protected zoomAll() {
        this.movie('WebCAD').executeCommand('ZOOMALL')
    }

    /**
     * 切换背景颜色
     */
    protected changeBKColor() {
        this.movie('WebCAD').executeCommand('BKCOLOR')

        this.setState({
            theme: (this.state.theme === 'dark') ? 'light' : 'dark'
        })
    }

    /**
     * 全屏/退出全屏
     */
    protected requestFullScreen() {
        this.props.onRequestFullScreen(!this.props.fullScreen)
    }

    /**
     * 窗口缩放
     */
    protected zoomWindow() {
        this.movie('WebCAD').executeCommand('ZOOMWINDOW')
    }

    /**
     * 测量面积
     */
    protected measureArea() {
        this.movie('WebCAD').executeCommand('AREA')
    }

    /**
     * 测量长度
     */
    protected measureLength() {
        this.movie('WebCAD').executeCommand('DIST')
    }

    /**
     * 鼠标在整个区域内移动
     */
    protected handleMouseMove() {
        if (this.flashLoadingDone) {
            // 如果falsh插件已经加载完成，清除定时器，重新开始定时
            if (this.timer) {
                clearTimeout(this.timer)
            } else {
                this.setState({
                    showBottomTool: true
                })
            }

            this.timer = setTimeout(() => {
                this.setState({
                    showBottomTool: false
                })
                this.timer = 0
            }, 1000)
        }
    }

    /**
     * BottomTool的MouseMove事件
     */
    protected handleMouseMoveBottomTool() {
        if (!this.state.showBottomTool) {
            this.setState({
                showBottomTool: true
            })
        }

        // 清除定时器
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = 0
        }
    }

    /**
     * 保持title不变
     */
    protected keepTitle() {
        setTimeout(() => {
            const name = docname(this.props.doc)

            if (document.title !== name) {
                // 不使用util/browser/browser的setTitle方法，是因为setTitle方法在IE下会延时1秒，所以这里直接用document.title = name
                document.title = name
            }
        }, 500)
    }
}