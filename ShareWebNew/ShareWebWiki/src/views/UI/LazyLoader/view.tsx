import * as React from 'react';
import UIView from '../../UI/view';
import LazyLoader from '../../../../ui/LazyLoader/ui.desktop';

export default function LazyLoaderView() {
    return (
        <UIView
            name={ '<LazyLoader />' }
            description={ '搜索组件' }
            api={
                [
                    {
                        name: 'limit',
                        type: Number,
                        required: false,
                        defaultValue: 200,
                        note: '翻页大小'
                    },
                    {
                        name: 'scroll',
                        type: Number,
                        required: false,
                        note: '滚动位置'
                    },
                    {
                        name: 'trigger',
                        type: Number,
                        required: false,
                        defaultValue: 0.75,
                        note: '触发滚动翻页的位置，使用小于1的数表示百分比位置'
                    },
                    {
                        name: 'onScroll',
                        type: Function,
                        required: false,
                        note: '滚动时触发'
                    },
                    {
                        name: 'onChange',
                        type: Function,
                        required: false,
                        note: '翻页时触发'
                    },
                ]
            }>
            <div style={ { height: 100, border: '1px solid #ccc' } }>
                <LazyLoader onChange={ (page, limit) => alert(`page: ${page}, limit: ${limit}`) }>
                    <div style={ { height: 300 } }></div>
                </LazyLoader>
            </div>
        </UIView>
    )
}