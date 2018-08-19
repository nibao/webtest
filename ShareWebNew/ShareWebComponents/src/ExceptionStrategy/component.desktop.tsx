import * as React from 'react';
import * as classnames from 'classnames'
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop'
import RadioBoxOption from '../../ui/RadioBoxOption/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import * as commonStyles from '../styles.desktop.css';
import ExceptionStrategyBase, { IconType } from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ExceptionStrategy extends ExceptionStrategyBase {
    render() {
        const { handler, selected, defaultSeleted } = this.state;
        const { warningHeader, warningContent, warningFooter, options, name, showCancelBtn, iconType } = handler;

        return (
            <Dialog
                width={400}
                title={__('提示')}
                buttons={[]}
                >
                <Panel>
                    <Panel.Main>
                        <div className={styles['container']}>
                            {
                                iconType === IconType.Message ?
                                    <UIIcon code={'\uf076'}
                                        color={'#5a8cb4'}
                                        size={40}
                                        className={styles['icon']}
                                        />
                                    : null
                            }
                            {
                                iconType === IconType.Confirm ?
                                    <UIIcon code={'\uf076'}
                                        color={'#5a8cb4'}
                                        size={40}
                                        className={styles['icon']}
                                        />
                                    : null
                            }
                            {
                                iconType === IconType.Error ?
                                    <UIIcon code={'\uf076'}
                                        color={'#5a8cb4'}
                                        size={40}
                                        className={styles['icon']}
                                        />
                                    : null
                            }
                            <div className={classnames({ [styles['content-right']]: !!iconType })}>
                                {
                                    warningHeader
                                        ? <div className={commonStyles.warningHeader}>{warningHeader}</div>
                                        : null
                                }
                                {
                                    warningContent
                                        ? <div className={commonStyles.warningContent}>{warningContent}</div>
                                        : null
                                }
                                {
                                    (options && options.length)
                                        ? options.map(({ value, display }) => (
                                            <div>
                                                <RadioBoxOption
                                                    name={name}
                                                    value={value}
                                                    onCheck={() => this.setState({ selected: value })}
                                                    checked={selected === value}
                                                    >
                                                    {display}
                                                </RadioBoxOption>
                                            </div>
                                        ))
                                        : null
                                }
                                {
                                    warningFooter
                                        ? <div className={commonStyles.warningFooter}>
                                            <CheckBoxOption
                                                onChange={this.toggleChecked.bind(this)}
                                                checked={defaultSeleted}
                                                >
                                                {warningFooter}
                                            </CheckBoxOption>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button type="submit" onClick={this.confrim.bind(this)}>{__('确定')}</Panel.Button>
                        {
                            showCancelBtn
                                ? <Panel.Button onClick={() => this.props.onCancel()} >{__('取消')}</Panel.Button>
                                : null
                        }
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }
}