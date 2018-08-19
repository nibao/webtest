declare namespace Components {
    namespace ResourceShare {
        interface Props extends React.Props<any> {


            onCancel(): void; // 关闭资源分享对话框

            onSuccess(): void; // 确定资源分享

            docs: Array<object>;// 选中的文件或者文件夹

        }

        interface State {

            selected: number; // 当前操作面板序号 0:个人空间 1：班级空间 2：资源中心

            params: object; // 分享选择信息

            doc: object; // 分享的文件对象

            url: string; // 分享文件的下载链接

            creator: string; // 文件的创建者

            uploader: string; // 执行分享的用户

            showLoading: boolean; // 分享中提示

            shareStatus: number; // 分享状态 0:pend预分享状态 1:分享成功 2：分享失败

            tipDir: string; // 分享到的目录，用于分享成功后的提示

            errorMsg: string; // 分享失败错误信息

            disableShare: boolean; // 禁用分享

            shareSlow: boolean; // 分享时间过长
        }
    }
}