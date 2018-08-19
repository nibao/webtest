import * as React from 'react'
import NWWindow from '../../ui/NWWindow/ui.client'
import { ClientComponentContext } from '../helper'
import PreviewView from './component.view'
import __ from './locale'

export default function Preview({ onOpenPreviewDialog, onClosePreviewDialog, doInnerShareLink, doOuterShareLink, doc, fields, id }) {
    return (
        <NWWindow
            title={__('预览')}
            id={id}
            onOpen={onOpenPreviewDialog}
            onClose={onClosePreviewDialog}
            width={900}
            height={800}
            {...fields}
        >
            <ClientComponentContext.Consumer>
                <div
                    style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}
                >
                    <PreviewView
                        doc={doc}
                        doInnerShareLink={(doc) => { doInnerShareLink(doc[0]) }}
                        doOuterShareLink={(doc) => { doOuterShareLink(doc[0]) }}
                    />
                </div>
            </ClientComponentContext.Consumer>
        </NWWindow>
    )
}