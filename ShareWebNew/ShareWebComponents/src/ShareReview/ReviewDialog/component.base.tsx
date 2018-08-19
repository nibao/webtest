import * as React from 'react';
import { webcomponent } from '../../../ui/decorators';

@webcomponent
export default class ReviewDialogBase extends React.Component<Components.ShareReview.ReviewDialog.Props, Components.ShareReview.ReviewDialog.State> {
    static defaultProps = {

    }

    state = {
        comments: '',
        overWords: false,
        result: false,
        disableSubmit: true
    }

    /**
     * 审核补充说明文本框内容改变
     */
    protected handleTextAreaChange = (value) => {
        this.setState({
            overWords: value.trim().length > 800 ? true : false,
            comments: value
        })
    }

    /**
     * 执行审核事件
     */
    protected handleReview = () => {
        if (!this.state.overWords) {
            this.props.onShareReview(this.props.fileInReview.applyid, this.state.result, this.state.comments)
        }
    }

    /**
     * 改变审核意见
     */
    protected changeApprovalStatus = (status) => {
        this.setState({
            disableSubmit: false,
            result: status
        })
    }
}
