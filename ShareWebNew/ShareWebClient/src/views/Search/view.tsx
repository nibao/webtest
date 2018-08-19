import * as React from 'react';
import FullSearch from '../../../components/FullSearch/component.desktop';
import { openDoc, handleApprovalCheck } from '../../helper'
import { splitGNS } from '../../../core/entrydoc/entrydoc';

export default function SearchView({ history, location }) {
    const { query } = location
    return (
        <FullSearch
            searchKeys={query.keys || ''}
            searchTags={query.tags || ''}
            searchRange={query.range ? { docid: query.range, root: false } : { docid: '', root: true }}
            doFilePreview={(doc) => {
                openDoc(doc, { newTab: true })
            }}
            doDirOpen={(doc) => {
                let lens = splitGNS(doc.docid).length;
                lens === 1 ?
                    openDoc(null, { newTab: true })
                    :
                    openDoc({ docid: splitGNS(doc.docid)[lens - 2] }, { newTab: true })
            }}
            doApprovalCheck={() => { handleApprovalCheck() }}
        />
    )
}