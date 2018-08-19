import * as React from 'react'
import LinkDocs from '../../../components/LinkDocs/component.mobile'
import Upload from '../../../components/Upload/component.mobile'
import { reset } from '../../../core/upload/upload'
import { docname, isDir } from '../../../core/docs/docs'
import { setOEMtitle } from '../../../core/oem/oem'
import { setTitle } from '../../../util/browser/browser'
import { openDoc, getLinkFromQuery, scrollTop } from '../../helper'
import { hashHistory } from 'react-router'
import * as styles from './styles.css'

export default class LinkView extends React.Component<any, any> {

    state = {
        linkDoc: {}
    }

    componentWillMount() {
        scrollTop();
    }

    componentWillReceiveProps() {
        scrollTop();
    }

    componentWillUnmount() {
        /** 退出link路由时重置上传 */
        reset()
    }

    render() {
        const linkDoc = getLinkFromQuery(this.props.location)

        return (
            <div className={styles['container']}>
                <LinkDocs
                    linkDoc={linkDoc}
                    onPathChange={openDoc}
                    onLoad={doc => {
                        if (doc === null || isDir(doc)) {
                            setOEMtitle()
                        } else {
                            setTitle(docname(doc))
                        }
                    }}
                />
                <Upload swf={'/libs/webuploader/dist/Uploader.swf'} />
            </div>
        )
    }
}