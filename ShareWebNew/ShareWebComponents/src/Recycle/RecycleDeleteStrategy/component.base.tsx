import * as React from 'react'
import WebComponent from '../../webcomponent'
import { setRetentionDays, getRetentionDays } from '../../../core/apis/efshttp/recycle/recycle';
import __ from './locale'


export default class RecycleDeleteStrategyBase extends WebComponent<Components.Recycle.RecycleDeleteStrategy.Props, Components.Recycle.RecycleDeleteStrategy.State> {
    static defaultProps = {
        docs: [{
            'docid': ''
        }]
    }

    state = {
        /**
         * 选中的指定回收站删除时长
         */
        durationSelection: -1,

        /**
         * 错误码
         */
        errorCode: -1,

        /**
         * 选中项是否发生了变动
         */
        isSelectionChange: false
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    async componentWillMount() {
        try {
            let { days: duration } = await getRetentionDays({ docid: this.props.docs[0].docid });
            this.setState({
                durationSelection: duration
            })
        } catch (error) {
            this.setState({
                errorCode: error.errcode
            })
        }


    }

    /**
     * 更改回收站删除时长
     */
    protected handleSelectStrategyMenu(item) {
        this.setState({
            durationSelection: item,
            isSelectionChange: true
        })
    }

    /**
     * 确认更改回收站删除时长
     */
    protected async handleConfirmChangeDeleteStrategy() {
        let { durationSelection } = this.state

        // 变更时长
        try {
            await setRetentionDays({ docid: this.props.docs[0].docid, days: durationSelection })
            this.context.toast(__('设置成功'), { code: '\uf063', size: 24, color: '#2aa879' })
            this.props.onStrategyClose()

        } catch (error) {
            this.setState({
                errorCode: error.errcode
            })
        }
    }
}