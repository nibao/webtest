import * as React from 'react';
import UIView from '../../UI/view';
import DataGrid from '../../../../ui/DataGrid2/ui.desktop';

export default function DataGrid2View() {
    return (
        <UIView
            name={ '<DataGrid />' }
            description={ '数据表格' }
            api={ [] }>
            <DataGrid
                fields={
                    [
                        {
                            label: '姓名',
                        },
                        {
                            label: '成绩',
                        }
                    ]
                }
            >
                {
                    [
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
                    ].map(record => (
                        <DataGrid.Row>
                            <DataGrid.Cell>
                                {
                                    record['name']
                                }
                            </DataGrid.Cell>
                            <DataGrid.Cell>
                                {
                                    record['score']
                                }
                            </DataGrid.Cell>
                        </DataGrid.Row>
                    ))
                }
            </DataGrid>
        </UIView>
    )
}