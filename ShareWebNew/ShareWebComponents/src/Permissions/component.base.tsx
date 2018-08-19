import * as React from 'react';
import { list } from '../../core/apis/eachttp/perm/perm';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import WebComponent from '../webcomponent';


interface Props {
    doc: Core.Docs.Doc;                       // 权限配置的文档
}

export default class PermissionsBase extends WebComponent<any, any>{

    static defaultProps: Props = {
        doc: null
    }

    state = {
        permConfigs: []
    }

    componentWillMount() {
        if (this.props.doc) {
            this.initPermConfig(this.props.doc);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.doc.docid !== this.props.doc.docid) {
            this.initPermConfig(nextProps.doc)
        }
    }


    /**
    * 初始化
    */
    async initPermConfig(doc: Core.Docs.Doc) {
        const docid = doc.docid;
        let userid = getOpenAPIConfig('userid');
        // 检查所有者权限， 转换当前文档路径
        const { ownerresults, permresults } = await list({ docid });
        // 当前登录用户的权限
        const current = [...ownerresults, ...permresults].filter(perm => perm.accessorid === userid)
        // 其他用户的权限
        const other = [...ownerresults, ...permresults].filter(perm => perm.accessorid !== userid)

        this.setState({
            permConfigs: [...current, ...other]
        })
    }
}