import * as React from 'react';
import { noop } from 'lodash';
import Panel from '../../../ui/Panel/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';
import { VerifyStatus } from '../helper';

const GroupAdderView: React.StatelessComponent<Components.Contact.GroupAdder.Props> = function GroupAdderView({
    value,
    verifyStatus = VerifyStatus.Legal,
    onGroupAddConfirm = noop,
    onGroupAddChange = noop,
    onGroupAddCancel = noop,
}) {

    return (
        <Panel>
            <Panel.Main>
                <div className={styles['dialog']}>
                    <Form>
                        <Form.Row>
                            <Form.Label>
                                <span>{__('分组名称：')}</span>
                            </Form.Label>
                            <Form.Field>
                                <TextBox
                                    value={value}
                                    onChange={onGroupAddChange}
                                    className={styles['input']}
                                    autoFocus={true}
                                />
                            </Form.Field>
                        </Form.Row>
                    </Form>
                    {
                        verifyStatus === VerifyStatus.Illegal ?
                            <div className={styles['warning']}>{__('分组名称不允许使用下列特殊字符 \ / : * ? " < > | ，且长度范围为 1~128 个字符，请重新输入。')}</div>
                            :
                            null
                    }
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button disabled={!value.trim()} type="submit" onClick={() => onGroupAddConfirm()}>{__('确定')}</Panel.Button>
                <Panel.Button onClick={() => onGroupAddCancel()}>{__('取消')}</Panel.Button>
            </Panel.Footer>
        </Panel>

    )
}


export default GroupAdderView;