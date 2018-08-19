declare namespace Components {
    namespace LimitRate {
        interface Props extends React.Props<void> {

        }

        interface State {
            /**
             * 限速配置开关状态
             */
            limitRateStatus: boolean;

            /**
             * 限速配置类型
             */
            limitRateType: number;

            /**
             * 是否显示限速配置弹窗
             */
            showLimitRateConfigDialog: boolean;

            /**
             * 搜索关键字
             */
            searchKey: string;

            /**
             * 限速配置信息
             */
            limitRateInfo: ReadonlyArray<Core.ShareMgnt.ncTLimitRateInfo>;

            /**
             * 限速信息总数
             */
            count: number;

            /**
             * 当前页
             */
            page: number;

            /**
             * 限速错误信息
             */
            errorInfo: {
                errCode: number;
                errMsg: string;
            };

            /**
             * 正在加载
             */
            loading: boolean;
        }
    }
}