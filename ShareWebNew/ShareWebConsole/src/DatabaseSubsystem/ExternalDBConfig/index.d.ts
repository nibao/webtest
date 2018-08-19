declare namespace Components {
    namespace DatabaseSubsystem {
        namespace ExternalDBConfig {
            type Props = {

            }

            type State = {
                /**
                 * 第三方数据库配置
                 */
                externalDBInfo?: Readonly<Core.DatabaseSubsystem.ncTExternalDBInfo>,

                /**
                 * 域名验证
                 */
                defaultHostValidateState?: number;

                /**
                 * 端口验证
                 */
                defaultPortValidateState?: number;

                /**
                 * 测试结果
                 */
                testResult?: boolean;

                /**
                 * 保存结果
                 */
                saveResult?: boolean;

            }
        }
    }
}



