import * as React from 'react'
import Docs from '../../components/Docs/component.mobile'

export default {
    'root': require('./Root/view').default,
    'index': require('./Index/view').default,
    'home': require('./Home/view').default,
    'home.documents': ({ history, location }) => {
        const { pathname, query } = location
        const { gns, link } = query
        const doc = (gns || link) ? { docid: `gns://${gns}`, link } : null
        return (
            <Docs
                doc={doc}
                onPathChange={(doc, { newTab = false } = {}) => {
                    const { docid, link } = doc || { docid: '', link: '' }
                    const nextPath = history.createPath({ pathname, query: { ...query, gns: docid.slice(6), link } })
                    if (newTab) {
                        window.open(`/#${nextPath}`)
                    } else {
                        history.push(nextPath)
                    }
                }}
            />
        )
    },
    'home.user': require('./User/view').default
}