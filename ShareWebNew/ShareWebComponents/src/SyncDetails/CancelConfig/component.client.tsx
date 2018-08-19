import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.client';
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import __ from './locale';
import * as styles from './styles.client.css';

interface Props {
    onConfirm: (check: boolean) => void;
    onCancel: () => void;
}

interface State {
    check: boolean
}

export default class ErrorMessage extends React.Component<Props, State> {

    state = {
        check: false
    }

    render() {
        return (
            <ConfirmDialog
                onConfirm={() => this.props.onConfirm(this.state.check)}
                onCancel={this.props.onCancel}
            >
                <div>
                    {__('取消上传将导致您的文档无法同步至云端，系统会将其保留原位置，您确定要执行此操作吗？')}
                </div>
                <div className={styles['checkbox']}>
                    <CheckBoxOption value={this.state.check} checked={this.state.check} onChange={this.onCheckChange.bind(this)} >
                        {__('本次退出/注销前，不再提示')}
                    </CheckBoxOption>
                </div>
            </ConfirmDialog>
        )
    }

    onCheckChange(check) {
        this.setState({
            check
        })
    }
}

