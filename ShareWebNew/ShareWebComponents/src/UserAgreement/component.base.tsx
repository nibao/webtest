import { getOemConfigBySection } from '../../core/apis/eachttp/config/config';
import { eachttp } from '../../core/openapi/openapi';
import { get as getUser } from '../../core/apis/eachttp/user/user'
import Webcomponent from '../webcomponent';

export default class UserAgreementBase extends Webcomponent<any, any> {
    state = {
        showAgreement: false,
        autoPopUserAgreement: false,
        agreementText: '', // 协议内容
        isReaded: false, // 阅读标识，只要已勾选一次就视为已阅读
        openEnter: false, // 禁用进入云盘按钮标识
    }
    componentDidMount() {
        this.initAutoPopUserAgreement()
    }

    /**
     * 初始化自动弹出用户协议
     * @private
     * @memberof UserAgreementBase
     */
    private async initAutoPopUserAgreement() {
        await this.getAutoPopUserAgreementOEM();
        this.state.autoPopUserAgreement ? await this.getAutoPopUserAgreementStatus() : null;
    }

    /**
     * 获取OEM用户协议自动弹出开关和内容
     * @private
     * @returns Promise对象
     * @memberof UserAgreementBase
     */
    private getAutoPopUserAgreementOEM() {
        return getOemConfigBySection({ section: 'anyshare' }).then(config => {
            const { autoPopUserAgreement, agreementText } = config;
            this.setState({
                autoPopUserAgreement: autoPopUserAgreement === 'true' ? true : false,
                agreementText: agreementText,
            })
        })
    }
    /**
     * 获取用户信息，判断是否需要显示用户协议
     * @memberof UserAgreementBase
     */
    private getAutoPopUserAgreementStatus() {
        getUser({}).then(({ agreedtotermsofuse }) => {
            this.setState({
                showAgreement: !agreedtotermsofuse,
            });
        });
    }


    /**
     * 处理勾选阅读用户协议checkbox
     * @protected
     * @param {MouseEvent} event 
     * @memberof UserAgreementBase
     */
    protected handleReadAgreement(event: MouseEvent) {
        let { isReaded } = this.state
        // 切换进入按钮禁用
        this.setState(
            { openEnter: event.target.checked }
        )
        // 第一次勾选，发送请求设置已读，后续勾选都不再发送请求
        isReaded ? null : (async () => {
            await eachttp('user', 'agreedtotermsofuse');
            await this.setState({
                isReaded: true
            })
        })()
    }

    protected handleOpen() {
        this.setState({
            showAgreement: false
        })
    }
}