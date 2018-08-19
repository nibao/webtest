import * as React from 'react'
import { getAppmetadata } from '../../core/apis/efshttp/file/file';
import { getConfig } from '../../core/config/config';

export default class CSFDetailsBase extends React.Component<Components.CSFDetails.Props, Components.CSFDetails.State> {
    state = {
        csfDetails: {}
    }

    componentWillMount() {
        this.getCSFDetails(this.props.doc)
    }

    private async getCSFDetails(doc: Core.Docs.Doc) {
        const thirdCsfConfig = await getConfig('third_csfsys_config')
        const csfSysId = thirdCsfConfig ? thirdCsfConfig.id : ''

        const res = await getAppmetadata({ docid: doc.docid, appid: csfSysId })

        let csfDetails = {}

        if (res.length && JSON.parse(res[0].appmetadata).classification_info) {
            csfDetails = JSON.parse(JSON.parse(res[0].appmetadata).classification_info)['zh-cn']
        }

        this.setState({
            csfDetails
        })
    }
}