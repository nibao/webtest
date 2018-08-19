import * as React from 'react';
import { noop } from 'lodash';
import { VisitorTypes } from './helper';

export default class VisitorAdderBase extends React.Component<Components.VisitorAdder.Props, any> {

    static defaultProps = {
        onAddVisitor: noop,

        onCancel: noop,

        showCSF: false,

        csfTextArray: []
    }

    state: Components.VisitorAdder.State = {
        candidates: [],

        layers: [],

        childrens: [],

        checkedInfos: []
    }


    /**
    * 添加候选人
    * @param candidate
    */
    protected handleAddCandidate(candidate: any): void {
        if (!this.isAdded(candidate)) {
            // 未添加
            this.setState({
                candidates: [...this.state.candidates, candidate]
            })
        }
    }

    private getInfo(candidate: any): { type: number, id: string } {
        return candidate.userid ? { type: VisitorTypes.USER, id: candidate.userid } : (candidate.depid ? { type: VisitorTypes.DEPARTMENT, id: candidate.depid } : { type: VisitorTypes.GROUP, id: candidate.id })
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
    protected removeCandidate(index: number): void {
        let newCandidates = [...this.state.candidates];
        newCandidates.splice(index, 1);

        this.setState({
            candidates: newCandidates
        })
    }

    /**
     * 将选中的访问者传出去
     */
    protected submitCandidates() {
        this.props.onAddVisitor(this.state.candidates);
    }


    /**
     * 进入部门或组织（mobile）
     */
    protected async enterDep(dep) {
        if (dep.depid) {
            const children = await dep.list(false)

            this.setState({
                layers: [...this.state.layers, dep],
                childrens: [...this.state.childrens, children]
            })
        }
    }

    /**
     * 返回到上一级(mobile)
     */
    protected goBackToLastLayer() {
        const { layers, childrens } = this.state

        if (layers.length === 1) {
            // 取消
            this.props.onCancel()
        } else {
            this.setState({
                layers: layers.slice(0, layers.length - 1),
                childrens: childrens.slice(0, childrens.length - 1)
            })
        }
    }

    /**
     * 选中的组织，部门，用户 发生变化(mobile)
     */
    protected handleSelectChange(info: any, checked: boolean) {
        if (checked) {
            this.setState({
                checkedInfos: [...this.state.checkedInfos, info]
            })
        } else {
            this.setState({
                checkedInfos: this.state.checkedInfos.filter(item => (item.depid ? item.depid : item.userid) !== (info.depid ? info.depid : info.userid))
            })
        }
    }
}