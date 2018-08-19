declare namespace Console {
    namespace StoragePoolManager {
        namespace StorageInitPanel {
            interface Props {

                /**
                 * 执行初始化操作
                 */
                onInit(): void;

            }

            interface State {

                /**
                 * 选择的系统存储策略
                 * {
                 *      name: 策略名称
                 *      mode: 策略值
                 * }
                 */
                storageStrategyMode: object;

                /**
                 * 错误信息
                */
                errorMsg: string;

                /**
                 * 错误提示信息
                 */
                errorStatus: number;

                /**
                 * 警告提示内容
                 */
                warningStatus: number;

                /**
                 * 等待提示信息
                 */
                loadingStatus: number;


            }

        }
    }
}