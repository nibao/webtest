import * as React from 'react';
import Recycle from '../../../components/Recycle/component.desktop';

export default function RecycleView({ history, location }) {
    const { pathname, query } = location
    const { gns, link, sort, by } = query
    const doc = (gns || link) ? { docid: `gns://${gns}`, link } : null
    return (
        <Recycle
            doc={doc}
            sort={sort}
            by={by}
            onPathChange={(doc, sort, by, { newTab = false } = {}) => {
                const { docid, link } = doc || { docid: '', link: undefined }
                const nextPath = history.createPath({ pathname, query: { gns: docid.slice(6), link, sort, by } })
                if (newTab) {
                    window.open(`/#${nextPath}`)
                } else {
                    history.push(nextPath)
                }
            }}
        />
    )
}