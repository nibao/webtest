import * as React from 'react';
import { noop, values } from 'lodash';
import WebComponent from '../webcomponent'
import { userValidation, getUserInfo } from '../../core/apis/thirdparty/resourceshare/resourceshare'
import session from '../../util/session/session';
import { SelectTargetType } from '../ResourceShare/help';

export default class ShareClassSpaceBase extends WebComponent<Components.ShareClassSpace.Props, any> {
    static defaultProps = {
        handleSelectChange: noop
    }
    state: Components.ShareClassSpace.State = {
        noClass: false,
        key: '',
        cyuid: '',
        activeIndex: '',
        classList: [],
    }
    componentDidMount() {
        this.props.onClassChange(SelectTargetType.SHARE_TO_CLASS, null);        
        this.initInfo();
    }

    async initInfo() {
        await this.initUserValidation();
        await this.initUserInfo();
    }

    /**
     * 获取账户验证并得到key
     * @memberof SharePersonSpaceBase
     */
    async initUserValidation() {
        const res = await userValidation({ user: session.get('account') });
        // FIXME:测试
        // const res = await userValidation({ user: '7990886176000000004' });
        const response = JSON.parse(res['response']);
        return new Promise((resolve) => this.setState({
            key: response.data,
        }, resolve));
    }

    /**
     * 获取用户班级列表和用户cyuid，初始化选择
     * @memberof SharePersonSpaceBase
     */
    async initUserInfo() {
        const res = await getUserInfo({ user: session.get('account'), key: this.state.key });
        // FIXME:测试
        // const res = await getUserInfo({ user: '7990886176000000004', key: this.state.key });
        const response = JSON.parse(res['response']);
        const classList = values(response.data.orglist.class);
        if (!classList.length) {
            this.setState({
                noClass: true,
            })
            return;
        }
        this.setState({
            classList,
            cyuid: response.data.user.cyuid,
            activeIndex: classList[0]['id'], // 默认选择第一个
        }, () => {
            const { cyuid, classList } = this.state;
            this.props.onClassChange(SelectTargetType.SHARE_TO_CLASS, { cyuid, class_id: classList[0]['id'], dirname: classList[0]['name'] })
        });
    }

    /**
     * 处理选择改变
     * @param {string} index 
     * @memberof SharePersonSpaceBase
     */
    handleClick(index: string, dirname: string) {
        if (this.state.activeIndex !== index) {
            this.setState({
                activeIndex: index
            }, () => this.props.onClassChange(SelectTargetType.SHARE_TO_CLASS, { cyuid: this.state.cyuid, class_id: this.state.activeIndex, dirname })
            )
        }
    }
}