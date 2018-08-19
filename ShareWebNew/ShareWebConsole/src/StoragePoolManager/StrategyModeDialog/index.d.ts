declare namespace Console {
    namespace StoragePoolManager {
        namespace StrategyModeDialog {
            interface Props {

                /**
                 * 当前系统存储策略
                 */
                currentMode: object;

                /**
                 * 确认变更存储策略配置
                 * mode: 选择的系统存储策略
                 */
                onStrategyChangeConfirm(mode: object): void;

                /**
                 * 取消变更存储策略配置
                 */
                onStrategyChangeCancel(): void;

            }

            interface State {

                /**
                 * 选择的系统存储策略
                 * {
                 *      name: 策略名称
                 *      mode: 策略值
                 * }
                 */
                selectedMode: object;

            }

        }
    }
}