import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent'
import { userValidation, getUserInfo } from '../../core/apis/thirdparty/resourceshare/resourceshare'
import session from '../../util/session/session';
import { SelectTargetType } from '../ResourceShare/help';

export default class SharePersonSpaceBase extends WebComponent<Components.SharePersonSpace.Props, any> {
    static defaultProps = {
        handleSelectChange: noop
    }
    state: Components.SharePersonSpace.State = {
        unknownRole: false,
        roleName: '',
        roleName_zh_cn: '',
        key: '',
        activeIndex: ''
    }
    componentDidMount() {
        this.props.onSourceTypeChange(SelectTargetType.SHARE_TO_SELF, null);        
        this.initInfo();
    }

    /**
     * 初始化查询，进行账户验证并获取用户信息
     * @memberof SharePersonSpaceBase
     */
    private async initInfo() {
        await this.initUserValidation();
        await this.initUserInfo();
    }
    /**
     * 获取账户验证并得到key
     * @memberof SharePersonSpaceBase
     */
    private async initUserValidation() {
        const res = await userValidation({ user: session.get('account') });
        // FIXME:测试
        // const res = await userValidation({ user: '7990886176000000004' });
        const response = JSON.parse(res['response']);

        return new Promise((resolve) => this.setState({
            key: response.data
        }, resolve))
    }


    /**
     * 获取用户角色信息并初始化选择
     * @memberof SharePersonSpaceBase
     */
    private async initUserInfo() {
        const res = await getUserInfo({ user: session.get('account'), key: this.state.key });
        // FIXME:测试
        // const res = await getUserInfo({ user: '7990886176000000004', key: this.state.key });
        const response = JSON.parse(res['response']);
        const rolelist = response.data.rolelist;
        if (rolelist[0].name !== 'teacher' && rolelist[0].name !== 'instructor') {
            this.setState({
                unknownRole: true,
            })
            return;
        };
        this.setState({
            roleName: rolelist[0].name,
            roleName_zh_cn: rolelist[0].name_zh_cn,
            activeIndex: rolelist[0].name === 'teacher' ? '1' : '11', // 默认选择第一个
        }, () => {
            const { key, activeIndex } = this.state;
            this.props.onSourceTypeChange(SelectTargetType.SHARE_TO_SELF, { key, type: activeIndex, dirname: '教学设计' })
        })
    }

    /**
     * 处理选择改变
     * @param {number} index 
     * @memberof SharePersonSpaceBase
     */
    protected handleClick(index: string, dirname: string) {
        const { activeIndex } = this.state;

        if (activeIndex !== index) {
            this.setState({
                activeIndex: index
            }, () => this.props.onSourceTypeChange(SelectTargetType.SHARE_TO_SELF, { key: this.state.key, type: this.state.activeIndex, dirname })
            )
        }
    }
}