import * as React from 'react';
import UIView from '../../UI/view';
import Watermark from '../../../../ui/Watermark/ui.desktop';

export default function WatermarkView() {
    return (
        <UIView
            name={ '<Watermark />' }
            description={ '水印组件' }
            api={
                [
                ]
            }>
            <Watermark>
                {
                    'Hello'
                }
            </Watermark>
        </UIView>
    )
}