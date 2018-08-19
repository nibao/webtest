import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Button from '../../../../ui/Button/ui.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

const ContactButtons: React.StatelessComponent<Components.ContactButtons.Props> = function ContactButtons({
    groups = [],
    groupSelection = [],
    onCreateGroup = noop,
    onModifyGroup = noop,
    onDeleteGroup = noop,
    onBatchAddContacts = noop,
}) {
    return (
        <div className={classnames(styles['contact-buttons'])}>
            <Button
                className={classnames(styles['contact-buttons-item'])}
                onClick={onBatchAddContacts}
                icon={'\uf099'}
            >
                {
                    __('添加联系人')
                }
            </Button>

            <Button
                className={classnames(styles['contact-buttons-item'])}
                onClick={onCreateGroup}
                icon={'\uf097'}
            >
                {
                    __('新建分组')
                }
            </Button>
            {
                groupSelection && groupSelection.length && groupSelection[0] !== groups[0] ?
                    [
                        <Button
                            className={classnames(styles['contact-buttons-item'])}
                            onClick={onModifyGroup}
                            icon={'\uf085'}
                        >
                            {
                                __('编辑分组')
                            }
                        </Button>
                        ,
                        <Button
                            className={classnames(styles['contact-buttons-item'])}
                            onClick={onDeleteGroup}
                            icon={'\uf046'}
                        >
                            {
                                __('删除分组')
                            }
                        </Button>
                    ]
                    :
                    null
            }
        </div>
    );
}
export default ContactButtons;