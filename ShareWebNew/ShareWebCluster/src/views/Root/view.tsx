import * as React from 'react';
import { setup } from '../../../core/cluster/cluster';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import * as styles from './styles';
import __ from './locale';

export default class RootView extends React.Component<any, any> {
    state = {
        /**
         * 应用服务不可用
         */
        appSysNotAvailable: null
    }

    componentDidMount() {
        setup({
            onAppSysNotAvailable: this.handleAppSysNotAvailable.bind(this)
        })
    }

    /**
     * 处理应用服务不可用
     */
    handleAppSysNotAvailable() {
        this.setState({
            appSysNotAvailable: true
        })
    }

    /**
     * 重置错误状态
     */
    resetStatus() {
        this.setState({
            appSysNotAvailable: null
        })
    }

    render() {
        const { header, main } = this.props;

        return (
            <div className={styles['view']}>
                <div>
                    {header}
                </div>
                <div className={styles['wrapper']}>
                    {main}
                </div>
                {
                    this.state.appSysNotAvailable ?
                        <MessageDialog onConfirm={this.resetStatus.bind(this)}>
                            {__('当前应用服务不可用，请检查应用节点。')}
                        </MessageDialog>
                        : null
                }
            </div>
        )
    }
}