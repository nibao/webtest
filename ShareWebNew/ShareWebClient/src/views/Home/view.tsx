import * as React from 'react'
import * as classnames from 'classnames'
import { PureComponent } from '../../../ui/decorators'
import { fetchMessages } from '../../../core/message/message'
import { fetchApprovalsCounts, resetApprovalsCounts } from '../../../core/audit/audit'
import { reset } from '../../../core/upload/upload'
import Upload from '../../../components/Upload/component.desktop'
import * as styles from './styles.css'
import UserAgreement from '../../../components/UserAgreement/component.desktop';

@PureComponent
export default class HomeView extends React.Component<any, any>{

    static defaultProps = {
        sidebar: null
    }

    componentDidMount() {
        fetchApprovalsCounts()
        fetchMessages()
    }

    componentWillUnmount() {
        /** 退出home路由时重置上传 */
        reset()
        // 退出home路由时重置审核数目
        resetApprovalsCounts()
    }

    render() {
        const { sidebar, main } = this.props
        
        return (
            <div className={styles['container']}>
                {
                    sidebar ?
                        <div className={styles['sidebar']}>{sidebar}</div> :
                        null
                }
                <div className={classnames(styles['main'], { [styles['sideless']]: sidebar === null })}>
                    {main}
                </div>
                <Upload swf={'/libs/webuploader/dist/Uploader.swf'} />
                <UserAgreement></UserAgreement>
            </div>
        )
    }
}