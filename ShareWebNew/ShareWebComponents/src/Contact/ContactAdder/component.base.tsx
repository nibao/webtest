import * as React from 'react';
import { noop } from 'lodash';
import { ContactTypes } from './helper';
import { getOpenAPIConfig } from '../../../core/openapi/openapi';
import __ from './locale'
export default class ContactAdderBase extends React.Component<Components.ContactAdder.Props, any> {

    static defaultProps = {
        onAddContactConfirm: noop,

        onAddContactCancel: noop
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state: Components.ContactAdder.State = {
        candidates: []
    }


    /**
    * 添加候选人
    * @param candidate
    */
    protected handleAddCandidate(candidate: any): void {
        // 未添加 && 选项为用户时添加
        if (!this.isAdded(candidate) && (this.getInfo(candidate).type === ContactTypes.USER)) {
            // 如果添加项为自己，则弹出提示框
            if (getOpenAPIConfig('userid') === candidate.userid) {
                this.context.toast(__('不能添加自己为联系人'))
                return;
            }
            this.setState({
                candidates: [...this.state.candidates, candidate]
            })
        }
    }

    private getInfo(candidate: any): { type: number, id: string } {
        return candidate.userid ? { type: ContactTypes.USER, id: candidate.userid } : (candidate.depid ? { type: ContactTypes.DEPARTMENT, id: candidate.depid } : { type: ContactTypes.GROUP, id: candidate.id })
    }

    /**
     * 检查访问者是否已添加
     * @param candidate
     */
    private isAdded(candidate: any): boolean {
        const { candidates } = this.state;
        if (candidates && candidates.length) {
            let { type: typeCan, id: idCan } = this.getInfo(candidate);
            return candidates.some((visitor) => {
                let { type, id } = this.getInfo(visitor);
                if (typeCan === type && idCan === id) {
                    return true;
                }
            });
        }
        return false;
    }

    /**
    * 清空备选访问者
    */
    protected clearCandidates() {
        if (this.state.candidates && this.state.candidates.length) {
            this.setState({
                candidates: []
            })
        }
    }

    /**
    * 移除备选访问者
    * @param index
    */
    protected removeCandidate(candidate): void {
        let { candidates } = this.state;
        this.setState({
            candidates: candidates.filter((can) => can.userid !== candidate.userid)
        })
    }

    /**
     * 将选中的访问者传出去
     */
    protected submitCandidates() {
        this.props.onAddContactConfirm(this.state.candidates);
    }


}