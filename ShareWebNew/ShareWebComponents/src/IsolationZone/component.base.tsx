import * as React from 'react';
import { list, listReversion } from '../../core/apis/efshttp/quarantine/quarantine';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { formatTime } from '../../util/formatters/formatters';
import WebComponent from '../webcomponent';
import { AppealedCode } from './helper';

export default class IsolationZoneBase extends WebComponent<Components.IsolationZone.Props, any> {
    static defaultProps = {

    }

    state: Components.IsolationZone.State = {
        quarantineDocs: [],
        currentDoc: null,
        appealDoc: null,
        versionDocs: [],
        isLoadingOver: false,
        selectedDoc: null,
        appealStatus: AppealedCode.NORMAL
    }

    componentWillMount() {
        this.onLoadFileList();
    }

    /**
     * 获取文件列表信息
     */
    protected async onLoadFileList() {
        let docs = await list();
        this.setState({ quarantineDocs: docs, isLoadingOver: true });

    }

    /**
     * 点击查看按钮,对应行高亮显示
     * @param doc 查看的文档对象
     */
    protected async onClickFileViewVersion(e, doc) {
        let { selectedDoc } = this.state;
        selectedDoc === doc ? e.stopPropagation() : null;
        // 如果获取文件列表报错，则代表文件已失效，弹出失效提示框
        try {
            let versiondocs = await listReversion({ docid: doc['docid'] });
            this.setState({
                currentDoc: doc,
                versionDocs: versiondocs
            });

        } catch (error) {
            this.setState({appealStatus: ErrorCode.ObjectTypeError});
        }
        
    }

    /**
     * 点击关闭查看窗口
     */
    protected onCloseInfoDialog() {
        this.setState({
            currentDoc: null,
            versionDocs: null
        });

    }

    /**
     * 点击申诉按钮
     * @param doc 要申诉的文档对象
     */
    protected async onClickFileAppeal(e, doc) {
        let { selectedDoc } = this.state;
        selectedDoc === doc ? e.stopPropagation() : null;
        // 如果获取文件列表报错，则代表文件已失效，弹出失效提示框
        try {
            await listReversion({ docid: doc['docid'] });
            this.setState({appealDoc: doc});
        } catch (error) {
            this.setState({appealStatus: ErrorCode.ObjectTypeError});
        }
        
    }

    /**
     * 关闭申诉窗口,根据申诉后的状态码更新文件的申诉状态
     */
    protected onCloseAppealDialog(appealCode) {
        let { quarantineDocs, appealDoc } = this.state;
        switch (appealCode) {
            case ErrorCode.ObjectTypeError: break;
            case ErrorCode.GNSInaccessible: break;
            case AppealedCode.NORMAL: break;
            case AppealedCode.OK:
            case ErrorCode.ParametersIllegal:
            default:
                this.setState({
                    quarantineDocs: quarantineDocs.map((doc) => {
                        doc === appealDoc ? doc['status'] = 2 : null;
                        return doc;
                    })
                })
                break;
        }
        this.setState({
            appealDoc: null,
            appealStatus: appealCode
        });

    }

    /**
     * 预览文件
     * @param currentDoc 预览的文档对象
     * @param versionDoc 预览的文档版本
     */
    protected async handlePreviewFile(currentDoc, versionDoc) {
        this.props.onPreview({ docid: currentDoc.docid, rev: versionDoc.rev })
    }

    /**
     * 时间戳转日期 精确到天
     * @param doc 文档对象
     */
    protected convertToDate(doc) {
        return formatTime(doc['appealexpiredtime'] / 1000, 'yyyy/MM/dd');

    }

    /**
     * 截止日期处理
     * @param doc 文档对象
     */
    protected handleDeadLine(doc) {
        return doc['appealexpiredtime'] > doc['servertime'];
    }

    /**
     * 高亮当前选中行
     * @param selection 选中行的文档对象
     */
    protected handleSelectionChange(selection) {
        this.setState({
            selectedDoc: selection
        });
    }


    /**
     * 关闭申诉提示框
     */
    protected onConfirmAppeal() {
        this.setState({ appealStatus: AppealedCode.NORMAL });
    }

    /**
     * 比较文件列表长度是否超过上限
     */
    protected compareDocsLens() {
        return this.state.quarantineDocs.length <= 17;
    }
}