import * as React from 'react';
import { decimal } from '../../util/validators/validators';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import { getErrorMessage } from '../../core/exception/exception';
import { usrmGetThirdPartyRootNode } from '../../core/thrift/sharemgnt/sharemgnt';
import RadioBoxOption from '../../ui/RadioBoxOption/ui.desktop';
import { ProgressCircle, MessageDialog, UIIcon, Text, ValidateBox } from '../../ui/ui.desktop';
import { SelectType } from '../../ui/Tree2/ui.base'
import Tree2 from '../../ui/Tree2/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import ImportOrganizationBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class ImportOrganization extends ImportOrganizationBase {
    root = usrmGetThirdPartyRootNode().then(res => (res.map(value => ({ ...value, isRoot: true }))))
    render() {
        return (
            <div >
                {
                    this.state.progress === -1 && !this.state.failMessage && !this.state.errorStatus ?
                        (<Dialog
                            title={__('导入第三方用户组织')}
                            onClose={this.props.onCancel}
                        >
                            <Panel>
                                <Panel.Main>
                                    <FlexBox>
                                        <FlexBox.Item align="top">
                                            <div className={styles['select-org']}>
                                                <div>
                                                    {
                                                        __('请在列表中选择您要导入的用户或组织：')
                                                    }
                                                </div>
                                                <div className={styles['select-org-box']}>
                                                    <div className={styles['select-tree']}>
                                                        <Tree2
                                                            selectType={SelectType.CASCADE_MULTIPLE}
                                                            checkbox={true}
                                                            data={this.root}
                                                            isLeaf={this.getNodeIsLeaf}
                                                            renderNode={node => node ? this.getNodeTemplate(node) : ''}
                                                            getNodeChildren={this.getChildren}
                                                            onSelectionChange={this.getSelectedNode}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </FlexBox.Item>
                                        <FlexBox.Item align="top">
                                            {/* <div className={styles['import-config-title']}>
                                        {
                                            __('请设置导入的方式：')
                                        }
                                    </div>
                                    <div className={styles['import-config']}>
                                        <div>
                                            <RadioBoxOption
                                                name="organization"
                                                value={false}
                                                onChange={(check, value) => { this.selectedImport(check, ImportOrganizationBase.ImportOptions.All) }}
                                                checked={this.state.importOption === ImportOrganizationBase.ImportOptions.All}
                                            >
                                                {__('导入选中的对象及其成员（包括上层的组织结构）')}
                                            </RadioBoxOption>   
                                        </div>
                                        <div className={styles['import-config-option']}>
                                            <RadioBoxOption
                                                name="organization"
                                                value={false}
                                                onChange={(check, value) => { this.selectedImport(check, ImportOrganizationBase.ImportOptions.CurrentAndChild) }}
                                                checked={this.state.importOption === ImportOrganizationBase.ImportOptions.CurrentAndChild}
                                            >
                                                {__('导入选中的对象及其成员（不包括上层的组织结构）')}
                                            </RadioBoxOption>
                                        </div>
                                        <div className={styles['import-config-option']}>
                                            <RadioBoxOption
                                                name="organization"
                                                value={false}
                                                onChange={(check, value) => { this.selectedImport(check, ImportOrganizationBase.ImportOptions.Current) }}
                                                checked={this.state.importOption === ImportOrganizationBase.ImportOptions.Current}
                                            >
                                                {__('仅导入用户账号（不包括组织结构）')}
                                            </RadioBoxOption>
                                        </div>
                                    </div> */}
                                            <div className={styles['import-config-title']}>
                                                {
                                                    __('在导入过程中，如果发现当前系统已存在同名的用户：')
                                                }
                                            </div>
                                            <div className={styles['import-config']}>
                                                <div>
                                                    <RadioBoxOption
                                                        name="namerepeat"
                                                        value={true}
                                                        onChange={this.setUserCover}
                                                        checked={this.state.option.userCover}
                                                    >
                                                        {__('覆盖同名用户')}
                                                    </RadioBoxOption>
                                                </div>
                                                <div className={styles['import-config-option']}>
                                                    <RadioBoxOption
                                                        name="namerepeat"
                                                        value={false}
                                                        onChange={this.setUserCover}
                                                        checked={!this.state.option.userCover}
                                                    >
                                                        {__('跳过同名用户')}
                                                    </RadioBoxOption>

                                                </div>
                                            </div>
                                            <div className={styles['import-config-title']}>
                                                {
                                                    __('对于每一个导入的新用户：')
                                                }
                                            </div>
                                            <div className={styles['import-config']}>
                                                <label>
                                                    {
                                                        __('用户配额空间设为：')
                                                    }
                                                </label>
                                                <ValidateBox
                                                    validator={decimal}
                                                    value={this.state.spaceSize === '' ? '' : this.state.spaceSize}
                                                    disabled={!this.state.spaceStatus}
                                                    onChange={this.changeDocSpace}
                                                    width={100}
                                                />
                                                <span> GB</span>
                                            </div>

                                        </FlexBox.Item>
                                    </FlexBox>
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button
                                        disabled={!this.state.selectedData.length || (this.state.spaceStatus && this.state.spaceSize === '')}
                                        onClick={this.importThirdUser}
                                    >
                                        {__('导入')}
                                    </Panel.Button>
                                    <Panel.Button onClick={this.props.onCancel} >{__('取消')}</Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>) :
                        null
                }
                {
                    this.state.progress !== -1 ?
                        (
                            <ProgressCircle
                                detail={__('正在导入 ${progress}%...', { progress: this.state.progress })}
                            />
                        ) :
                        null
                }
                {
                    this.state.failMessage ?
                        (
                            <MessageDialog onConfirm={this.closeFailInfo}>
                                {
                                    this.state.failMessage
                                }
                            </MessageDialog>
                        ) :
                        null
                }

                {
                    this.state.errorStatus ?
                        (
                            <MessageDialog onConfirm={this.closeErrorInfo}>
                                {
                                    getErrorMessage(this.state.errorStatus)
                                }
                            </MessageDialog>
                        ) :
                        null
                }
            </div >
        )
    }

    getNodeTemplate(node) {
        if (node.displayName) {
            return (
                <span>
                    <UIIcon code="\uf007" size={20} className={styles['node']} />
                    <Text>
                        {
                            node.displayName
                        }
                    </Text>
                </span>
            )
        }

        if (node.isRoot) {
            return (
                <span>
                    <UIIcon code="\uf008" size={20} className={styles['node']} />
                    <Text>
                        {
                            node.name
                        }
                    </Text>
                </span>
            )
        }

        return (
            <span>
                <UIIcon code="\uf009" size={20} className={styles['node']} />
                <Text>
                    {
                        node.name
                    }
                </Text>
            </span>
        )
    }
}