import * as React from 'react'
import DocWatermarkConfig from '../DocWatermark.Config/component.view'
import DocWatermarkScope from '../DocWatermark.Scope/component.view'
import WebComponent from '../webcomponent'

export default class DocWatermark extends WebComponent<any, any>{
    render() {
        return (
            <div>
                <DocWatermarkConfig />
                <DocWatermarkScope />
            </div>
        )
    }
}