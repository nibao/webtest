import * as React from 'react';
import { noop, map } from 'lodash';
import { getCsfTip } from '../../../core/csf/csf'
import { Panel, Select, Form } from '../../../ui/ui.desktop'
import EditCSFBase from './component.base';
import * as styles from './styles.view';
import __ from './locale';

export default class View extends EditCSFBase {
    render() {
        const { onCancel, onConfirm } = this.props;
        const { selectedCSF, csfOptions } = this.state;

        return (
            <Panel>
                <Panel.Main>
                    <div style={{ height: '150px' }}>
                        <div className={styles['content']}>
                            {getCsfTip(this.props.docs)}
                        </div>
                        <Form>
                            <Form.Label>
                                {__('文件密级：')}
                            </Form.Label>
                            <Form.Field>
                                <Select
                                    className={styles['select-csf']}
                                    menu={{ width: 120, maxHeight: 130 }}
                                    value={selectedCSF}
                                    onChange={this.changeSelectedCSF.bind(this)}
                                    >
                                    {
                                        map(csfOptions, ({ level, text }) => (
                                            <Select.Option
                                                className={level === 0 && styles['hide-option']}
                                                value={level}
                                                selected={level === selectedCSF}
                                                >
                                                {text}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Field>
                        </Form>
                    </div>
                </Panel.Main>
                <Panel.Footer>
                    <Panel.Button
                        onClick={() => onConfirm(selectedCSF, this.docs)}
                        disabled={!selectedCSF}
                        >
                        {__('确定')}
                    </Panel.Button>
                    <Panel.Button
                        onClick={onCancel}
                        >
                        {__('取消')}
                    </Panel.Button>
                </Panel.Footer>
            </Panel >
        )
    }
}