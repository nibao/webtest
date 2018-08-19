declare namespace Console {
    namespace FireWallConfig {
        interface Props extends React.Props<void> {
            // 从 appConfig 子组件中获取到的用户输入的四个端口值
            portsFromAppConfig: {
                /**
                 * Web客户端访问https端口输入值
                 */
                webClientHttps: number

                /**
                 * Web客户端访问https端口输入值
                 */
                webClientHttp: number

                /**
                 * 对象存储https端口输入值
                 */
                objStorageHttps: number

                /**
                 * 对象存储http端口输入值
                 */
                objStorageHttp: number
            }

            /**
             * 从 appConfig 子组件中获取到的 旧的 web客户端和对象存储的 http https 端口值
             */
            oldAppPortsFromAppConfig: {
                /**
                * Web客户端访问https端口输入值
                */
                webClientHttps: number | string

                /**
                 * Web客户端访问https端口输入值
                 */
                webClientHttp: number | string

                /**
                 * 对象存储https端口输入值
                 */
                objStorageHttps: number | string

                /**
                 * 对象存储http端口输入值
                 */
                objStorageHttp: number | string
            }

            /**
             * 当需要更新防火墙规则时，调用该函数
             */
            fireWallUpdateStatus: (
                updateSuccess: Array<string | number>,
                updateFail: Array<string | number>,
                shouldUpdateCount: number
            ) => void

        }

        interface State {
            /**
             * 防火墙规则
             */
            fireWallAccessingRules: ReadonlyArray<Core.ECMSManager.ncTFirewallInfo>

            /**
             * 缺少的端口号
             */
            missingAppPorts: Array<number>

            /**
             * 防火墙开关状态
             * 开关关闭则 添加防火墙规则按钮灰化,下方列表灰化
             * 开关开启则 添加防火墙规则按钮可用,下方列表不灰化
             */
            fireWallStatus: boolean

            /**
             * 添加/编辑/删除 访问规则弹窗状态
             * 用一个弹窗来表示 添加 编辑 两个功能，根据传入到 弹窗的不同的值，来初始化弹窗内容
             */
            showAccessingRuleDialog: number

            /**
             * 用户确定删除规则，但删除失败时弹窗中报错信息
             */
            errorMsg: string

            /**
             * 添加/编辑/删除 失败时，ErrorDialog.Title 所提示的不同表头信息
             */
            errorMsgTitle: number

            /**
             * 存放从后端返回的防火墙规则信息
             */
            record: Record,

            /**
             * validateBox 输入框验证状态
             */
            validateState: {
                /**
                 * 服务器端口输入框验证状态
                 */
                servicePortInfo: number

                /**
                 * 端口描述输入框验证状态
                 */
                portDescInfo: number

                /**
                 * 源IP输入框验证状态
                 */
                sourceIpInfo: number

                /**
                 * 子网掩码输入框验证状态
                 */
                subnetMaskInfo: number
            }

            /**
             * 转圈圈组件提示状态
             */
            progressCircleTips: number
        }

        interface Record {
            /**
             * 所属子系统
             */
            role_sys: string

            /**
             * 服务端口
             */
            port: string

            /**
             * 协议
             */
            protocol: string

            /**
             * 端口描述
             */
            service_desc: string

            /**
             * 源IP/掩码
             */
            source_net: string
        }
    }
}