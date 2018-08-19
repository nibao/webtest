import * as React from 'react'
import { runtime, attachFlashPicker, uploadFileList, trigger, EventType } from '../../../core/upload/upload'
import { webcomponent } from '../../../ui/decorators'

@webcomponent
export default class Picker extends React.Component<any, any>{
    static defaultProps = {
        directory: false,
        multiple: true
    }

    state = {
        runtime: '',
        clearing: false
    }

    runtimeError = null

    constructor(props, context) {
        super(props, context)
        this.setDirectoryPicker = this.setDirectoryPicker.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    async componentWillMount() {
        try {
            this.setState({
                runtime: await runtime
            })
        } catch (e) {
            this.runtimeError = e
        }
    }

    setDirectoryPicker(input) {
        const { runtime } = this.state
        const { directory } = this.props
        if (runtime === 'html5' && directory && input) {
            /**
             * react低版本不支持 webkitdirectory 
             * 在 componentDidMount 后设置 webkitdirectory 
             **/
            (input as HTMLInputElement).setAttribute('webkitdirectory', '')
        }
    }

    /**
     * 鼠标移入事件
     * @param e 
     */
    handleMouseEnter(e) {
        if (this.state.runtime === 'flash') {
            attachFlashPicker(e.currentTarget, this.props.dest)
        }
        if (typeof this.props.onMouseEnter === 'function') {
            this.props.onMouseEnter(e)
        }
    }

    /**
     * 文件输入框onChange
     * @param e 
     */
    handleChange(e) {
        uploadFileList(e.target.files, this.props.dest)
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e)
        }
        /**
         * 清除input数据
         */
        this.setState({ clearing: true }, () => {
            this.setState({ clearing: false })
        })
    }

    /**
     * 点击事件
     * @param e 
     */
    handleClick(e) {
        if (this.runtimeError) {
            trigger(EventType.UPLOAD_RUNTIME_ERROR, null, this.runtimeError)
        }
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(e)
        }
    }
}