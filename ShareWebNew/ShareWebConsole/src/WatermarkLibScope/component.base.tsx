import * as React from 'react';
import { ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { PureComponent } from '../../ui/decorators';
import WebComponent from '../webcomponent';
import __ from './locale';

interface State {
    // 开启下载水印的文档库列表
    downloadWatermarkDocList: Array<any>;

    // 列表中的文档库总数
    count: number;

    // 当前页
    page: number;

    // 搜索关键字
    searchKey: string;

    // 是否对所有自定义文档库开启水印
    downloadWatermarkForAllStatus: boolean;

    // 是否添加文档库状态
    addDocLibStatus: boolean;
}

interface WaterMarkDocInfo {
    // 对象ID
    objId: string;

    // 对象类型，都为 3，表示自定义文档库
    objType: number;

    // 对象名称
    objName: string;
}

@PureComponent
export default class WatermarkLibScopeBase extends WebComponent<any, any> {

    state = {
        downloadWatermarkForAllStatus: false,
        downloadWatermarkDocList: [],
        count: 0,
        page: 1,
        searchKey: '',
        addDocLibStatus: false,
    }

    // 每页默认加载条数
    DEFAULT_PAGESIZE = 200;

    async componentWillMount() {
        // 获取是否对所有自定义文档库开启水印
        const downloadWatermarkForAllStatus = await ShareMgnt('GetDownloadWatermarkForAllStatus');
        const [downloadWatermarkDocList, count] = await this.getDownloadWatermarkDocInfo(this.state.page, '');
        this.setState({ downloadWatermarkForAllStatus, downloadWatermarkDocList, count });
    }

    /**
     * 获取下载水印文档库信息
     */
    async getDownloadWatermarkDocInfo(page: number, key: string) {
        if (key) {
            const info = await Promise.all([
                // 搜索开启下载水印的文档库总数
                ShareMgnt('SearchDownloadWatermarkDocByPage', [key, (page - 1) * this.DEFAULT_PAGESIZE, this.DEFAULT_PAGESIZE]),
                // 搜索开启下载水印的文档库信息
                ShareMgnt('SearchDownloadWatermarkDocCnt', [key])
            ]);
            return info;
        } else {
            const info = await Promise.all([
                // 分页获取开启下载水印的文档库信息
                ShareMgnt('GetDownloadWatermarkDocByPage', [(page - 1) * this.DEFAULT_PAGESIZE, this.DEFAULT_PAGESIZE]),
                // 获取开启下载水印的文档库总数
                ShareMgnt('GetDownloadWatermarkDocCnt')
            ]);
            return info;
        }

    }

    /**
     * 设置是否对所有自定义文档库开启水印
     */
    setDownloadWatermarkForAllStatus(status: boolean) {
        this.setState({ downloadWatermarkForAllStatus: status }, async () => {
            await ShareMgnt('SetDownloadWatermarkForAllStatus', [status]);
        });
    }

    /**
     * 分页时触发
     */
    async handlePageChange(page: number, limit: number) {
        this.setState({ inFetching: true }, async () => {
            const [downloadWatermarkDocList, count] = await this.getDownloadWatermarkDocInfo(page, this.state.searchKey);
            this.setState({ inFetching: false, downloadWatermarkDocList, count, page });
        });
    }

    /**
     * 改变搜索关键字
     */
    changeSearchKey(key: string) {
        this.setState({ searchKey: key });
    }

    setLoadingStatus() {
        this.setState({ inFetching: true });
    }

    /**
     * 搜索开启下载水印的文档库信息
     */
    async searchDownloadWatermarkDocInfo(key: string) {
        // 从第一页开始
        const [downloadWatermarkDocList, count] = await this.getDownloadWatermarkDocInfo(1, key);
        this.setState({ count });
        return downloadWatermarkDocList;
    }

    /**
     * 载入搜索结果
     */
    loadSearchResult(data: Array<WaterMarkDocInfo>) {
        this.setState({ inFetching: false, downloadWatermarkDocList: data, page: 1 });
    }

    /**
     * 删除开启下载水印的文档库
     */
    async deleteDownloadWatermarkDoc(id: string, lib: any) {
        if (!this.state.downloadWatermarkForAllStatus) {
            await ShareMgnt('DeleteDownloadWatermarkDoc', [id]);
            const [downloadWatermarkDocList, count] = await this.getDownloadWatermarkDocInfo(this.state.page, this.state.searchKey);
            this.setState({ downloadWatermarkDocList, count: this.state.count - 1 });
            manageLog(ManagementOps.SET, __('删除 固化水印文档范围 文档库“${docLib}” 成功', { docLib: lib.objName }), '', Level.INFO);
        }
    }

    /**
     * 打开添加文档库Dialog
     */
    activateAddDocLib() {
        this.setState({ addDocLibStatus: true });
    }

    /**
     * 添加文档库
     */
    async handleSubmitDocLib(libs: Array<any>) {
        for (let lib of libs) {
            if (!this.state.downloadWatermarkDocList.some(item => item.objId === lib.docId)) {
                await ShareMgnt('AddDownloadWatermarkDoc', [lib.docId]);
                manageLog(ManagementOps.SET, __('添加 固化水印的文档范围 文档库“${docLib}” 成功', { docLib: lib.name }), '', Level.INFO);
                this.setState({
                    downloadWatermarkDocList: [{ objId: lib.docId, objType: 3, objName: lib.name }, ...this.state.downloadWatermarkDocList],
                    count: this.state.count + 1
                });
            }
        }
        this.setState({ addDocLibStatus: false });
    }

    /**
     * 取消添加文档库
     */
    handleCancelAddDocLib() {
        this.setState({ addDocLibStatus: false });
    }
}