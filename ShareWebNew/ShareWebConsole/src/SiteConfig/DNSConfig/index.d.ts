declare namespace Console {
    namespace DNSConfig {
        interface Props extends React.Props<void> {

        }

        interface State {
            /**
             * 首选地址输入值
             */
            preferredAddress: string

            /**
             * 备选地址1输入值
             */
            firstBackupAddress: string

            /**
             * 备份地址2输入值
             */
            secondBackupAddress: string

            /**
             * 保存/取消 按钮状态
             */
            isDnsServerAddressChange: boolean

            /**
             * validateBox 小黄框提示状态
             */
            validateBoxStatus: {
                /**
                 * DNS服务器首选地址 ValidateBox验证状态
                 */
                preferredAddressStatus: number

                /**
                 * DNS服务器备选地址1 ValidateBox验证状态
                 */
                firstBackupAddressStatus: number

                /**
                 * DNS服务器备选地址2 ValidateBox验证状态
                 */
                secondBackupAddressStatus: number
            }

            /**
             * 弹窗状态
             */
            errorDialogStatus: number

            /**
             * 错误信息提示
             */
            errorMsg: string
        }
    }
}