import { getUserQuota } from '../../core/apis/eachttp/quota/quota';
import WebComponent from '../webcomponent';

export default class QuitSpaceBase extends WebComponent<any, any> implements Components.QuotaSpace.Base {

    state = {
        /**
         * 所有文档已使用空间总额
         */
        totalUsed: 0,

        /**
         * 所有文档配额空间总额
         */
        totalQuota: 0,

        /**
         * 单个文档配额空间数组
         */
        quotaStackDatas: [],

        /**
         * 账户总体配额空间总数组
         */
        totalStackDatas: []
    }


    async componentWillMount() {
        const background = ['#b2c9ce', '#d1edcf', '#f5ebc8', '#d0e4eb', '#c0dfbe', '#ebddaa', '#c2d4d6', '#a1d49d', '#e0cb93', '#a8b4b5'];
        let { quotainfos } = await getUserQuota();
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
        const totalUsed = quotainfos.reduce((previousValue, quotaInfo) => previousValue + quotaInfo.used, 0);
        const totalQuota = quotainfos.reduce((previousValue, quotaInfo) => previousValue + quotaInfo.quota, 0);

        const quotaStackDatas = quotainfos.map(function (quotaInfo, index) {
            return {
                used: quotaInfo.used,
                doctype: quotaInfo.doctype,
                docname: quotaInfo.docname,
                quota: quotaInfo.quota,
                background: background[index % background.length],
            }
        }, this);



        // 用户所有的存储空间
        const totalStackDatas = quotaStackDatas.map(function (quotaStackData, index) {
            return {
                docname: quotaStackData.docname,
                value: quotaStackData.used,
                background: background[index % background.length],
            }
        }).concat({
            value: totalQuota - totalUsed,
            background: '#fff',
        })

        this.setState({
            totalUsed,
            totalQuota,
            quotaStackDatas,
            totalStackDatas
        })
    }



}