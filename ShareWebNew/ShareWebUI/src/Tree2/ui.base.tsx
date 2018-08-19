import * as React from 'react'

/**
 * @todo 
 * 1. 补充类型
 * 2. 添加 onDataLoad，异步加载数据时触发
 */

/**
 * 节点展开状态
 */
export enum NodeStatus {
    UNEXPANDED,
    EXPANDING,
    EXPANDED
}

/**
 * 选择类型
 */
export enum SelectStatus {
    TRUE = 1,
    HALF = 0.5,
    FALSE = 0
}

/**
 * 选择类型
 */
export enum SelectType {
    /**
     * 禁止选中
     */
    NONE = 0,

    /**
     * 同级单选
     */
    SINGLE = 1,

    /**
     * 同级多选
     */
    MULTIPLE = 2,

    /**
     * 级联单选
     */
    CASCADE_SINGLE = 3,

    /**
     * 级联多选
     */
    CASCADE_MULTIPLE = 4,

    /**
     * 无限制
     */
    UNRESTRICTED = 5
}

export default class Tree extends React.Component<any, any>{

    state = {
        nodeStatus: {},
        selectStatus: {}
    }

    treeData: { [id: string]: Array<any> } = {}
    loadStatus = {}
    selectedIds: Array<string> = []

    async componentWillMount() {
        this.treeData = { '': await this.props.data }
        this.loadStatus = { '': true }
        this.toggleExpand('')
    }

    componentWillReceiveProps({ data, selectType, getNodeChildren }) {
        if (getNodeChildren !== this.props.getNodeChildren || data !== this.props.data) {
            /**
             * 树数据改变，重置树数据、选择状态
             */
            this.treeData = { '': data }
            this.loadStatus = { '': true }
            this.selectedIds = []
            this.setState({
                nodeStatus: {},
                selectStatus: {}
            })
            this.toggleExpand('')
        } else if (selectType !== this.props.selectType) {
            /**
             * 选择类型改变，重置树选择状态
             */
            this.selectedIds = []
            this.setState({
                selectStatus: {}
            })
        }
    }

    /**
     * 展开节点
     * @param id 
     */
    public async toggleExpand(id: string) {
        const { getNodeChildren, selectType } = this.props
        const { nodeStatus, selectStatus } = this.state
        switch (nodeStatus[id]) {
            case NodeStatus.EXPANDED:
                this.setState({
                    nodeStatus: { ...nodeStatus, [id]: NodeStatus.UNEXPANDED }
                })
                return
            case NodeStatus.EXPANDING:
                return
            default:
                let nextSelectStatus = selectStatus
                if (!this.loadStatus[id]) {
                    this.setState({
                        nodeStatus: { ...nodeStatus, [id]: NodeStatus.EXPANDING }
                    })
                    const lastDotIndex = id.lastIndexOf('.')
                    this.treeData[id] = await getNodeChildren(this.treeData[id.slice(0, lastDotIndex)][id.slice(lastDotIndex + 1)])
                    if (selectType === SelectType.CASCADE_MULTIPLE) {
                        nextSelectStatus = { ...selectStatus }
                        this.treeData[id].forEach((data, index) => {
                            nextSelectStatus[`${id}.${index}`] = selectStatus[id] || SelectStatus.FALSE
                        })
                    }
                }
                this.setState({
                    nodeStatus: { ...nodeStatus, [id]: NodeStatus.EXPANDED },
                    selectStatus: nextSelectStatus
                })
                this.loadStatus[id] = true
                return
        }
    }

    /**
     * 级联选择子节点
     * @param nodeId 
     * @param status 
     * @param selectStatus 
     */
    private cascadeSelectChildren(nodeId, status, selectStatus) {
        selectStatus[nodeId] = status
        if (this.treeData[nodeId]) {
            this.treeData[nodeId].forEach((data, i) => {
                this.cascadeSelectChildren(`${nodeId}.${i}`, status, selectStatus)
            })
        }
    }

    /**
     * 级联选择父节点
     * @param nodeId 
     * @param status 
     * @param selectStatus 
     */
    private cascadeSelectParent(nodeId, status, selectStatus) {
        nodeId.split('.').forEach((id, i, arr) => {
            const upperId = arr.slice(0, arr.length - i).join('.')
            if (this.treeData[upperId] && this.treeData[upperId].find((data, i) => selectStatus[`${upperId}.${i}`] !== status)) {
                selectStatus[upperId] = SelectStatus.HALF
            } else {
                selectStatus[upperId] = status
            }
        })
    }

    /**
     * 选择节点
     * @param id 
     */
    public toggleSelect(id: string) {
        const { selectType } = this.props
        const { selectStatus } = this.state

        let nextSelectStatus = {}

        switch (selectType) {

            case SelectType.SINGLE:
                nextSelectStatus = { [id]: selectStatus[id] === SelectStatus.TRUE ? SelectStatus.FALSE : SelectStatus.TRUE }
                this.selectedIds = nextSelectStatus[id] === SelectStatus.TRUE ? [id] : []
                break

            case SelectType.MULTIPLE:
                this.selectedIds = []
                const parentNodeId = id.slice(0, id.lastIndexOf('.'))
                this.treeData[parentNodeId].forEach((data, i) => {
                    const currentNodeId = `${parentNodeId}.${i}`
                    if (currentNodeId === id) {
                        nextSelectStatus[currentNodeId] = selectStatus[id] === SelectStatus.TRUE ? SelectStatus.FALSE : SelectStatus.TRUE
                    } else {
                        nextSelectStatus[currentNodeId] = selectStatus[currentNodeId]
                    }

                    if (nextSelectStatus[currentNodeId] === SelectStatus.TRUE) {
                        this.selectedIds.push(currentNodeId)
                    }
                })
                break

            case SelectType.CASCADE_SINGLE:
                this.selectedIds = []
                const hasSelectedChild = Object.keys(selectStatus).find(key => selectStatus[key] === SelectStatus.TRUE && key.startsWith(id) && key !== id)
                let nextStatus = !hasSelectedChild && selectStatus[id] === SelectStatus.TRUE ? SelectStatus.FALSE : SelectStatus.TRUE
                id.split('.').forEach((id, index, arr) => {
                    const currentNodeId = arr.slice(0, index + 1).join('.')
                    nextSelectStatus[currentNodeId] = nextStatus
                    if (index > 0 && nextStatus === SelectStatus.TRUE) {
                        this.selectedIds.push(currentNodeId)
                    }
                })
                break

            case SelectType.CASCADE_MULTIPLE:
                const status = selectStatus[id] === SelectStatus.TRUE ? SelectStatus.FALSE : SelectStatus.TRUE
                nextSelectStatus = { ...selectStatus }
                this.cascadeSelectChildren(id, status, nextSelectStatus)
                this.cascadeSelectParent(id, status, nextSelectStatus)
                break

            case SelectType.UNRESTRICTED:
                nextSelectStatus = {
                    ...selectStatus,
                    [id]: selectStatus[id] === SelectStatus.TRUE ? SelectStatus.FALSE : SelectStatus.TRUE
                }
                break

            default: break
        }
        this.setState({ selectStatus: nextSelectStatus }, () => {
            if (typeof this.props.onSelectionChange === 'function') {
                this.props.onSelectionChange(this.getSelections())
            }
        })
    }


    /**
     * 获取级联多选选择项
     * @param nodeId 
     */
    private getCascadeSelections(nodeId = '') {
        if (nodeId && this.state.selectStatus[nodeId] === SelectStatus.TRUE) {
            this.selectedIds.push(nodeId)
        } else if (this.treeData[nodeId] && this.treeData[nodeId].length) {
            this.treeData[nodeId].forEach((data, index) => this.getCascadeSelections(`${nodeId}.${index}`))
        }
    }

    /**
     * 获取无限制选择项
     * @param nodeId 
     */
    private getUnRestrictSelections(nodeId = '') {
        if (nodeId && this.state.selectStatus[nodeId] === SelectStatus.TRUE) {
            this.selectedIds.push(nodeId)
        }
        if (this.treeData[nodeId] && this.treeData[nodeId].length) {
            this.treeData[nodeId].forEach((data, index) => this.getUnRestrictSelections(`${nodeId}.${index}`))
        }
    }

    /**
     * 获取选中节点
     */
    public getSelections() {
        switch (this.props.selectType) {
            case SelectType.CASCADE_MULTIPLE:
                this.selectedIds = []
                this.getCascadeSelections()
                break
            case SelectType.UNRESTRICTED:
                this.selectedIds = []
                this.getUnRestrictSelections()
            default:
                break
        }
        return this.selectedIds.map((selectedId) => {
            const lastDotIndex = selectedId.lastIndexOf('.')
            return this.treeData[selectedId.slice(0, lastDotIndex)][selectedId.slice(lastDotIndex + 1)]
        })
    }
}