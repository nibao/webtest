
declare namespace Console {
    namespace NetworkOverView {
        interface Props extends React.Props<void> {

            /**
             * 跳转到服务器管理
             */
            doServerRedirect: () => void
        }

        interface State {
            /**
             * 高可用信息
             */
            vipInfos: Array<Core.ECMSManager.ncTVipInfo>;

            /**
             * 当前编辑的高可用节点
             */
            editingVipInfo: EditingVipInfo | null;

            /**
             * 错误值
             */
            errorCode: number;

            /**
             * 进度信息
             */
            progressStatus: number;

            /**
             * IP合法性验证结果
             */
            IPValidateResult: number;

            /**
             * 子网掩码合法性验证结果
             */
            maskValidateResult: number;

            /**
             * 网卡验证结果
             */
            nicValidateResult: number;

            /**
             * 保存警告提示
             */
            warning: boolean;

            /**
             * 错误信息
             */
            errorInfo: any;

            /**
             * 高可用的状态
             */
            keepaLivedStatus: boolean;
        }

        interface EditingVipInfo {
            /**
             * 网络信息
             */
            vipInfo?: Core.ECMSManager.ncTVipInfo;

            /**
             * 当前网络类型
             */
            type?: number;
        }
    }
}