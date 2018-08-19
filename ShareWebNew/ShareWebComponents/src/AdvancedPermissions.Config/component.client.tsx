import * as React from 'react';
import Panel from '../../ui/Panel/ui.desktop'
import Dialog from '../../ui/Dialog2/ui.client';
import Form from '../../ui/Form/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import AdvancedPermissions from '../AdvancedPermissions/component.desktop';
import AdvancedPermissionsConfigBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class AdvancedPermissionsConfig extends AdvancedPermissionsConfigBase {

    render() {
        const { showDeny, disabledOptions, allowOwner, allowPerms, accessorName } = this.props;
        const { allow, deny, isowner } = this.state;

        return (
            <Dialog
                width={showDeny ? 450 : 300}
                >
                <Panel>
                    <Panel.Main>
                        <div className={styles['dialog-main']} >
                            {
                                accessorName
                                    ?
                                    <div className={styles['visitor']}>
                                        <Form>
                                            <Form.Row>
                                                <Form.Label>
                                                    <label>{__('访问者：')}</label>
                                                </Form.Label>
                                                <Form.Field>
                                                    <div title={accessorName}>
                                                        <TextBox value={accessorName} readOnly={true} />
                                                    </div>
                                                </Form.Field>
                                            </Form.Row>
                                        </Form>
                                    </div>
                                    : null
                            }
                            <AdvancedPermissions
                                showDeny={showDeny}
                                disabledOptions={disabledOptions}
                                allowOwner={allowOwner}
                                allow={allow}
                                deny={deny}
                                isowner={isowner}
                                onChange={this.updateAdvancedPerm.bind(this)}
                                allowPerms={allowPerms}
                                />
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            type="submit"
                            onClick={this.set.bind(this)}
                            disabled={!(allow || deny || (isowner && allowOwner))}
                            >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button
                            onClick={this.closeAdvancedPermission.bind(this)}
                            >
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }

}