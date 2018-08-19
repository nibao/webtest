import * as React from 'react';
import * as classnames from 'classnames';
import { noop, isEqual } from 'lodash';
import DataGrid from '../../../../ui/DataGrid/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import { shrinkText } from '../../../../util/formatters/formatters';
import __ from './locale';

const ContactGroups: React.StatelessComponent<Components.ContactGroups.Props> = function ContactGroups({
    groups = [],
    getDefaultSelection = noop,
    onGroupSelectionChange = noop,
}) {
    return (
        <DataGrid
            data={groups}
            select={true}
            height={'100%'}
            onSelectionChange={(selection) => onGroupSelectionChange([selection])}
            getDefaultSelection={getDefaultSelection}

        >
            <DataGrid.Field
                label={__('联系人分组')}
                field="groupname"
                width="30"
                formatter={(groupname, group) => (
                    <Title content={`${group['groupname']}(${group['count']})`}>
                        <span> {shrinkText(`${group['groupname']}`, { limit: 30 })}</span>
                        <span>{`(${group['count']})`}</span>
                    </Title>
                )}
            />
        </DataGrid>
    );
}
export default ContactGroups;