import * as React from 'react';
import UIView from '../../UI/view';
import DataGrid from '../../../../ui/DataGrid/ui.desktop';

export default function DataGridView() {
    return (
        <UIView
            name={ '<DataGrid />' }
            description={ '数据表格' }
            api={
                [
                    {
                        name: 'data',
                        type: Array,
                        required: false,
                        note: '列表数据'
                    },
                    {
                        name: 'height',
                        type: Number,
                        required: false,
                        note: '表格高度'
                    },
                    {
                        name: 'onDblClickRow',
                        type: Function,
                        required: false,
                        note: '双击数据行触发'
                    },
                    {
                        name: 'onClickRow',
                        type: Function,
                        required: false,
                        note: '点击行触发'
                    },
                    {
                        name: 'getDefaultSelection',
                        type: Function,
                        required: false,
                        note: '获取默认选中项目，返回要选中的项或数组'
                    },
                    {
                        name: 'getRecordStatus',
                        type: Function,
                        required: false,
                        note: '获取数据状态'
                    },
                    {
                        name: 'onSelectionChange',
                        type: Function,
                        required: false,
                        note: '选中项改变时触发'
                    },
                    {
                        name: 'onPageChange',
                        type: Function,
                        arguments: [

                        ],
                        required: false,
                        note: '翻页时触发'
                    },
                ]
            }>
            <DataGrid
                select={ { required: true } }
                getRecordStatus={ (o, i) => {
                    return {
                        disabled: o.score < 60,
                    };
                } }
                data={ [
                    {
                        name: '张三',
                        score: 99,
                    },
                    {
                        name: '李四',
                        score: 100,
                    },
                    {
                        name: '王五',
                        score: 59,
                    },
                ] }
            >
                <DataGrid.Field
                    label="姓名"
                    field="name"
                    formatter={ (val, index, { disabled }) => {
                        return (
                            <div style={ { color: disabled ? '#d0d0d0' : '#353535' } }>
                                {
                                    val
                                }
                            </div>
                        )
                    } }
                />
                <DataGrid.Field
                    label="成绩"
                    field="score"
                    formatter={ (val, index, { disabled }) => {
                        return (
                            <div style={ { color: disabled ? '#d0d0d0' : '#353535' } }>
                                {
                                    val
                                }
                            </div>
                        )
                    } }
                />
            </DataGrid>
        </UIView>
    )
}