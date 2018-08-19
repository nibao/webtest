import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../Dialog2/ui.desktop';
import Panel from '../Panel/ui.desktop';
import UIIcon from '../UIIcon/ui.desktop';
import WizardStep from '../Wizard.Step/ui.desktop';
import WizardBase from './ui.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Wizard extends WizardBase {
    static Step = WizardStep;

    render() {
        return (
            <Dialog
                title={this.props.title}
                onClose={this.props.onCancel}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['crumbs']}>
                            {
                                React.Children.map(this.props.children, (child, index) => (
                                    <span
                                        className={classnames(
                                            [styles['crumb']],
                                            { [styles['active']]: this.state.activeIndex === index },
                                            { [styles['configured']]: this.state.activeIndex > index }
                                        )}
                                        title={child.props.title}
                                    >
                                        {
                                            child.props.title
                                        }
                                        {
                                            React.Children.count(this.props.children) > index + 1 ?
                                                <UIIcon
                                                    className={styles['icon']}
                                                    size="16"
                                                    code={'\uf002'}
                                                    color={'#999'}
                                                />
                                                : null
                                        }
                                    </span>
                                ))
                            }
                        </div>
                        <div>
                            {
                                React.Children.map(this.props.children, (child, index) => (
                                    React.cloneElement(child, {
                                        active: this.state.activeIndex === index
                                    })
                                ))
                            }
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        {
                            this.state.activeIndex !== 0 ?
                                <Panel.Button onClick={this.navigate.bind(this, WizardBase.Direction.BACKWARD)}>{__('上一步')}</Panel.Button> : null
                        }
                        {
                            this.state.activeIndex === React.Children.count(this.props.children) - 1 ?
                                <Panel.Button
                                    type="submit"
                                    onClick={this.onFinish.bind(this)}
                                    disabled={this.props.children[this.state.activeIndex].props.disabled}
                                >
                                    {__('完成')}
                                </Panel.Button> :
                                <Panel.Button
                                    onClick={this.navigate.bind(this, WizardBase.Direction.FORWARD)}
                                    disabled={this.props.children[this.state.activeIndex].props.disabled}
                                >
                                    {__('下一步')}
                                </Panel.Button>
                        }
                        <Panel.Button onClick={this.onCancel.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }
}