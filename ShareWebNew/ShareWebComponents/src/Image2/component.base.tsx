import * as React from 'react'
import { isDir, docname } from '../../core/docs/docs';
import * as fs from '../../core/filesystem/filesystem'
import { findImageType } from '../../core/extension/extension'
import { bindEvent, unbindEvent } from '../../util/browser/browser'
import { getContextWindow } from '../../ui/decorators'

@getContextWindow
export default class Image extends React.Component<any, any>{
    static defaultProps = {
        doc: null
    }

    state = {
        images: [],
        index: 0,
        showGallery: true
    }

    constructor(props, context) {
        super(props, context)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillMount() {
        const { doc } = this.props
        this.buildGallery(doc)
    }

    componentWillReceiveProps({ doc }) {
        if (doc !== this.props.doc) {
            this.buildGallery(doc)
        }
    }

    componentDidMount() {
        const window = this.getContextWindow()
        bindEvent(window, 'keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        const window = this.getContextWindow()
        unbindEvent(window, 'keydown', this.handleKeyDown)
    }

    /**
     * 生成相册
     * @param param0 
     */
    async buildGallery(doc) {
        if (doc) {
            const { docid, link, password } = doc
            let { images } = this.state,
                index = images.findIndex(image => image.docid === docid),
                files

            if (index === -1) {
                // 此处原来的实现有问题，直接去做了list操作，会导致当外链图片的父目录docid不是外链本身的父目录docid时报错
                // 暂时用捕获异常的手段处理
                try {
                    files = (await fs.list({ docid: docid.slice(0, -33), link, password })).files
                } catch (ex) {
                    files = [doc]
                } finally {
                    images = files.filter(doc => !isDir(doc) && !!findImageType(docname(doc)))
                    index = images.findIndex(image => image.docid === docid)

                    // 如果预览的版本不是最新版本，要屏蔽左右键
                    if (doc.rev !== images[index].rev) {
                        images = [doc]
                        index = 0
                    }
                }
            }
            this.setState({
                index,
                images
            })
        }
    }

    /**
     * 加载大图
     * @param index 
     */
    async load(index) {
        const { images } = this.state
        if (index < 0 || index >= images.length) {
            return
        }
        if (typeof this.props.onImageChange === 'function') {
            this.props.onImageChange(images[index])
        } else {
            this.setState({
                index
            })
        }
    }

    /**
     * 下一张
     */
    next() {
        this.load(this.state.index + 1)
    }

    /**
     * 上一张
     */
    prev() {
        this.load(this.state.index - 1)
    }

    /**
     * 切换错略图
     */
    toggleGallery() {
        this.setState({
            showGallery: !this.state.showGallery
        })
    }

    /**
     * 键盘事件处理
     * @param e 
     */
    handleKeyDown(e) {
        if (!e.defaultPrevented) {
            switch (e.keyCode) {
                case 37:
                case 38:
                    this.prev()
                    e.preventDefault()
                    break
                case 39:
                case 40:
                    this.next()
                    e.preventDefault()
                    break
            }
        }
    }
}