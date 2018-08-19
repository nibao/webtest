import * as React from 'react';
import { noop } from 'lodash';
import { Button, UIIcon, SelectMenu, ComboSearchBox } from '../../../ui/ui.desktop';
import { REQUESTTYPE, showType } from '../helper';
import * as styles from './styles.desktop.css';
import __ from './locale';

const ToolBar: React.StatelessComponent<Components.ShareApply.ToolBar.Props> = ({
    type = REQUESTTYPE.ALL,
    keys = [],
    searchKey = '',
    searchValue = [],
    renderOption = noop,
    renderComboItem = noop,
    doTypeChange = noop,
    doFilterResultChange = noop,
}) => (
        <div className={styles['container']}>
            <div
                className={styles['title']}
            >
                {__('共享申请')}
            </div>

            {/* <ComboSearchBox
                className={styles['search-box']}
                keys={keys}
                searchKey={searchKey}
                searchValue={searchValue}
                renderOption={renderOption}
                renderComboItem={renderComboItem}
                onComboChange={doFilterResultChange}
            /> */}

            <SelectMenu
                value={type}
                label={<Button
                    className={styles['type-selection']}
                >
                    <span className={styles['type-text']}>
                        {showType(type)}
                    </span>
                    <UIIcon
                        code="\uF04C"
                        size="14px"
                    />
                </Button>}
                anchorOrigin={['right', 'bottom']}
                targetOrigin={['right', 'top']}
                closeWhenMouseLeave={true}
                onChange={doTypeChange}
            >
                <SelectMenu.Option
                    value={REQUESTTYPE.ALL}
                    label={showType(REQUESTTYPE.ALL)}
                />
                <SelectMenu.Option
                    value={REQUESTTYPE.PENDING}
                    label={showType(REQUESTTYPE.PENDING)}
                />
                <SelectMenu.Option
                    value={REQUESTTYPE.AUDITED}
                    label={showType(REQUESTTYPE.AUDITED)}
                />
            </SelectMenu>
        </div>
    )

export default ToolBar

