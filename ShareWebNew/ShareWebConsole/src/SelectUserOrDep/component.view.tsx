///<reference path="./component.base.d.ts" />

import * as React from 'react'
import { noop } from 'lodash';
import OrganizationTree from '../OrganizationTree/component';
import { NodeType } from '../OrganizationTree/helper';
import SearchDep from '../SearchDep/component.desktop';

export default function SelecteUserOrDep({ userid, selectedType = [NodeType.ORGANIZATION, NodeType.DEPARTMENT, NodeType.USER], onSelected }: Components.SelectUserOrDepBase.Props) {
    return (
        <div>
            <div>
                <SearchDep
                    onSelectDep={value => { onSelected(value) }}
                    userid={userid}
                    width="100%"
                    selectType={selectedType}
                />
            </div>
            <div>
                <OrganizationTree
                    userid={userid}
                    selectType={selectedType}
                    onSelectionChange={value => { onSelected(value) }}
                />
            </div>
        </div>
    )
}
