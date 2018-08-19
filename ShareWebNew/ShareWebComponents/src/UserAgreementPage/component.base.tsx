import { getOemConfigBySection } from '../../core/apis/eachttp/config/config';
import Webcomponent from '../webcomponent';

export default class UserAgreementPageBase extends Webcomponent<any, any> {
    state = {
        agreementText: ''  // 协议内容
    }

    componentDidMount() {
        this.getUserAgreement();
    }

    /**
     * 获取用户协议
     * @private
     * @returns Promise对象
     * @memberof UserAgreementPageBase
     */
    private getUserAgreement() {
        return getOemConfigBySection({ section: 'anyshare' }).then(config => {
            const { agreementText } = config;
            this.setState({
                agreementText: agreementText,
            })
        })
    }
}