declare namespace Components {
    namespace LimitRateUserConfig {
        interface Props extends React.Props<void> {
            /**
             * 取消网速限制配置事件
             */
            onCancelLimitRateConfig: () => void;

            /**
             * 确认网速限制配置事件
             */
            onConfirmLimitRateConfig: () => void;

            /**
             * 当前编辑的限速信息
             */
            editLimitRateInfo: Core.ShareMgnt.ncTLimitRateInfo;

        }

        interface State {
            /**
             * 限制用户对象
             */
            limitUsers: Array<any>;

            /**
             * 速度配置
             */
            rateConfig: {
                /**
                 * 上传速度
                 */
                uploadRate: string;

                /**
                 * 下载速度
                 */
                downloadRate: string;
            };

            /**
             * 速度限制复选框勾选状态
             */
            limitCheckStatus: {
                limitUploadCheckStatus: boolean;
                limitDownloadCheckStatus: boolean;
            };

            /**
             * 验证状态
             */
            validateState: {
                /**
                 * 上传速度验证状态
                 */
                uploadRate: number;

                /**
                 * 下载速度验证状态
                 */
                downloadRate: number;

                /**
                 * 整体限制验证状态
                 */
                limitState: number;
            }

            /**
             * 限速列表已存在的用户
             */
            userAlreadyExisted: Array<any>;
        }
    }
}