import * as React from 'react';
import { LoadState } from './helper';
import __ from './locale';

export default class ImageBoxBase extends React.Component<UI.ImageBox.Props, any> implements UI.ImageBox.Base {
    state = {
        /**
         * 图片资源
         */
        src: null,

        /**
         * 图片加载状态
         */
        loadState: 0,

        /**
         * 图片style样式
         */
        imgStyle: {
            opacity: '0'
        },
    }

    componentWillMount() {
        this.load(this.props.src);
    }

    /**
     * 传入的资源改变时 重新加载
     */
    componentWillReceiveProps({ src }) {
        if (src !== this.props.src) {

            this.setState({
                imgStyle: {
                    opacity: '0'
                }
            })


            this.load(src);
        }
    }

    /**
     * 加载
     */
    load(src): void {
        this.setState({ src })
    }

    protected handleError(e: React.SyntheticEvent<any>) {
        this.props.onError(e)
    }
}