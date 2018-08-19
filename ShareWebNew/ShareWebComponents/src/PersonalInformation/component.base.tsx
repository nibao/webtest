import * as React from 'react';
import { noop } from 'lodash';
import * as Highcharts from 'highcharts';
import { getUserQuota } from '../../core/apis/eachttp/quota/quota';
import { getConfig } from '../../core/config/config';
import { editeMailAddress, get as getUser } from '../../core/apis/eachttp/user/user'
import { formatSize } from '../../util/formatters/formatters';
import { UserType } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class PersonalInformationBase extends React.Component<Components.PersonalInformation.Props, Components.PersonalInformation.State>{
    constructor(props, context) {
        super(props, context)
    }

    static defaultProps = {
        doChangePassword: noop
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        totalUsed: 0,
        totalQuota: 0,
        quotaStackDatas: [],
        userinfo: null,
        csfLevelEnum: 5,
        passwordUrl: '',
        emailEditing: false,
        emailValue: '',
        errCode: null
    }

    /**
     * 编辑前邮箱地址
     */
    preEmail = ''

    async componentDidMount() {
        const background = ['#b2c9ce', '#d1edcf', '#f5ebc8', '#d0e4eb', '#c0dfbe', '#ebddaa', '#c2d4d6', '#a1d49d', '#e0cb93', '#a8b4b5'];
        const [{ quotainfos }, userinfo, config] = await Promise.all([getUserQuota(), getUser(), getConfig()])
        let totalUsed = 0, totalQuota = 0;

        quotainfos.sort(function (a, b) {
            switch (true) {
                case a.doctype === 'userdoc':
                    return -1;
                case b.doctype === 'userdoc':
                    return 1;
                case (a.doctype === 'groupdoc' && b.doctype === 'groupdoc'):
                    return a.docname.localeCompare(b.docname);
            }
        })
        const quotaStackDatas = quotainfos.map(function (quotaInfo, index) {
            totalUsed += quotaInfo.used;
            totalQuota += quotaInfo.quota;
            return {
                used: quotaInfo.used,
                doctype: quotaInfo.doctype,
                docname: quotaInfo.docname,
                quota: quotaInfo.quota,
                background: background[index % background.length]
            }
        }, this);

        // 用户所有的存储空间
        const totalStackDatas = quotaStackDatas.map(function (quotaStackData, index) {
            return {
                name: quotaStackData.docname + __(' 使用'),
                description: formatSize(quotaStackData.used),
                y: quotaStackData.used,
                color: background[index % background.length]
            }
        }).concat({
            name: __('未使用空间'),
            description: formatSize(totalQuota - totalUsed),
            y: totalQuota - totalUsed,
            color: '#fff'
        })

        this.setState({
            totalQuota,
            totalUsed,
            quotaStackDatas,
            userinfo,
            csfLevelEnum: config['csf_level_enum'],
            passwordUrl: config['third_pwd_modify_url'],
            emailValue: userinfo.mail
        })
        this.drawPie('pie', totalStackDatas)
    }

    /**
     * 绘制饼图
     * @param {string} elementID 绘制区域的元素id
     * @param {ReadonlyArray<object>} data 配额数据数组
     */
    drawPie(elementID: string, data: ReadonlyArray<object>) {
        Highcharts.chart(elementID, {
            chart: {
                backgroundColor: '#FFFFFF',
                type: 'pie',
                /**
                 * 饼图在给定的宽高里居中显示，取宽高中较小的值为基值确定直径，以下给定宽高确定的圆直径大小为220px
                 */
                height: 265,
                width: 340
            },
            credits: {
                enabled: false
            },
            title: {
                /* title默认为chart title */
                text: null
            },
            tooltip: {
                /**
                 * headerFormat默认为{point.name}
                 */
                headerFormat: undefined,
                pointFormat: '{point.name}：{point.description}'
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    borderColor: '#e3e3e3',
                    borderWidth: 1
                }
            },
            series: [{
                data
            }]
        });
    }

    /**
     * 修改密码
     */
    async handleChangePassword() {
        if (this.state.emailEditing) {
            this.cancelEditEmail();
        }
        const { passwordUrl, userinfo } = this.state;
        userinfo.usertype !== UserType.LocalUser && passwordUrl ? this.props.doChangePassword(passwordUrl) : this.props.doChangePassword();
    }

    /**
     * 点击修改邮箱按钮
     */
    handleEditEmail() {
        this.preEmail = this.state.emailValue;
        this.setState({
            emailEditing: true
        })
    }

    /**
     * 输入邮箱地址
     */
    updateEmailValue(emailValue) {
        this.setState({
            emailValue
        })
    }

    /**
     * 确认修改邮箱
     */
    async confirmEditEmail() {
        const { emailValue } = this.state;
        const { toast } = this.context;
        if (emailValue === this.preEmail) {
            this.setState({
                emailEditing: false
            })
            return;
        }
        try {
            await editeMailAddress({
                emailaddress: this.state.emailValue
            });
            toast(__('编辑成功'));
            this.setState({
                emailEditing: false
            })
        } catch (e) {
            this.setState({
                errCode: e.errcode
            })
        }
    }

    /**
     * 取消修改邮箱
     */
    cancelEditEmail() {
        this.setState({
            emailValue: this.preEmail,
            emailEditing: false
        })
    }
}