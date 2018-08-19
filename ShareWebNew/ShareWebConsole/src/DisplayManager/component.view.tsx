import * as React from 'react';
import { Text, UIIcon, FlexBox } from '../../ui/ui.desktop';
import SetManagerByDep from '../SetManagerByDep/component.view';
import DisplayManagerBase from './component.base';
import * as styles from './styles.view.css';
import * as manager from './assets/manager.png';

export default class DisplayManager extends DisplayManagerBase {
    render() {
        return (
            <div>
                <div className={styles['container']}>
                    <FlexBox>
                        <FlexBox.Item>
                            <div>
                                <image src={manager} />
                            </div>
                        </FlexBox.Item>
                        <FlexBox.Item>
                            <div className={styles['managers']} >
                                <Text>
                                    {
                                        this.state.manager.length ?
                                            this.state.manager.join(',') :
                                            '---'
                                    }
                                </Text>
                            </div>
                        </FlexBox.Item>
                        <FlexBox.Item>
                            <div className={styles['edited']}>
                                {
                                    this.props.departmentId === '-1' || this.props.departmentId === '-2' || !this.props.hasPermission ?
                                        null :
                                        (
                                            <UIIcon
                                                code="\uf01c"
                                                onClick={this.openEditDialog}
                                                size={20}
                                            />
                                        )

                                }
                            </div>
                        </FlexBox.Item>
                    </FlexBox>
                </div>

                {
                    this.state.isEdited ?
                        (
                            <SetManagerByDep
                                departmentId={this.props.departmentId}
                                departmentName={this.props.departmentName}
                                userid={this.props.userid}
                                onCancel={this.cancelEditing}
                                onSetSuccess={this.updateManagers}
                            />
                        ) :
                        null
                }
            </div>
        )
    }
}