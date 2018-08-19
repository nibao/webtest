import * as React from 'react';
import { noop } from 'lodash'
import { attribute as getDocAttribute } from '../../core/apis/efshttp/file/file';
import { isDir } from '../../core/docs/docs'

/**
 * 标签设置状态，添加 or 编辑 or none
 */
export enum Status {
    None,  // 什么都不是

    Add,   // 添加标签

    Edit   // 编辑标签
}

export default class TagBoxBase extends React.Component<Components.TagBox.Props, Components.TagBox.State> {

    static defaultProps = {
        doJumpSearch: noop
    }

    state = {
        status: Status.None,

        showEditDialog: false,

        tags: [],

        showAdderDialog: false,
    }

    componentWillMount() {
        this.initTags(this.props.docs);
    }

    componentWillReceiveProps(nextProps) {
        this.initTags(nextProps.docs, nextProps);
    }

    /**
     * 初始化标签
     */
    private initTags(docs: Core.Docs.Docs, nextProps?) {
        if (docs && docs.length) {
            if (docs.length === 1 && !isDir(docs[0])) {
                // 选中单个文件
                this.showTags(docs[0]);

                if (nextProps) {
                    if (nextProps.tags && nextProps.tags !== this.state.tags) {
                        this.setState({
                            tags: nextProps.tags
                        })
                    }
                }

            }
            else if (docs.length > 1 && !docs.some((doc) => isDir(doc))) {
                // 选中多个文件
                this.setState({
                    status: Status.Add,
                    tags: [],

                })
            } else {
                // 选中了文件夹
                this.setState({
                    status: Status.None,
                    tags: []
                })
            }
        } else {
            // 未选中文件
            this.setState({
                tags: [],
                status: Status.None
            })
        }
    }

    /**
     * 单个文件操作：选中单个文件, 显示'编辑'和具体的标签
     */
    private showTags(doc: Core.Docs.Doc = this.props.docs[0]) {
        getDocAttribute({ docid: doc.docid }).then(({ tags }) => {
            this.setState({
                tags,
                status: Status.Edit
            })
        }, () => this.setState({
            tags: [],
            status: Status.Edit
        }))
    }

    /**
     * 单个文件操作：切换编辑标签dialog是否显示
     */
    protected toggleEditDialog(flag: boolean): void {
        this.setState({
            showEditDialog: flag
        })
    }

    /**
     * 单个文件操作：更新标签
     */
    protected updateTags(tags: ReadonlyArray<string>, doc: Core.Docs.Doc): void {
        if (this.props.docs && this.props.docs.length && this.props.docs.length === 1 && this.props.docs[0].docid === doc.docid) {
            this.setState({
                tags
            })
        }
    }

    /**
     * 多个文件操作：切换添加标签Dialog是否显示
     */
    protected toggleAdderDialog(flag: boolean): void {
        this.setState({
            showAdderDialog: flag
        })
    }

    /**
     * 点击“标签添加”按钮
     */
    protected triggerAddTag(platform: 'client' | 'desktop') {
        if (platform === 'client') {
            if (this.props.docs && this.props.docs.length > 1 && typeof this.props.doAddTag === 'function') {
                this.props.doAddTag(this.props.docs)
            }
        } else {
            this.toggleAdderDialog(true)
        }
    }

    /**
     * 点击“标签编辑”按钮
     */
    protected triggerEditTag(platform: 'client' | 'desktop') {
        if (platform === 'client') {
            if (this.props.docs && this.props.docs.length === 1 && typeof this.props.doEditTag === 'function') {
                this.props.doEditTag(this.props.docs)
            }
        } else {
            this.toggleEditDialog(true)
        }
    }

}