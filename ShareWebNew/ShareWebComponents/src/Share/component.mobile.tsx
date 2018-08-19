import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash'
import { formatterErrorText, formatterName, Status } from '../../core/permission/permission';
import UIIcon from '../../ui/UIIcon/ui.mobile'
import AppBar from '../../ui/AppBar/ui.mobile'
import Drawer from '../../ui/Drawer/ui.mobile'
import MessageDialog from '../../ui/MessageDialog/ui.mobile'
import ProgressCircle from '../../ui/ProgressCircle/ui.mobile'
import AdvancedPermissionsConfig from '../AdvancedPermissions.Config/component.mobile'
import VisitorAdder from '../VisitorAdder/component.mobile'
import SharePermissions from '../Share.Permissions/component.mobile'
import ErrorMessages from './ErrorMessages/component.mobile'
import ShareBase from './component.base'
import * as styles from './styles.mobile'
import __ from './locale'

export default class Share extends ShareBase {

    componentWillReceiveProps({ doc }) {
        if (doc && (this.props.doc !== doc)) {

            this.filePath = '';

            this.filePathMobile = ''

            this.doctype = '';

            this.doc = doc

            this.setState({
                showShare: false,

                apvCase: false,

                secretMode: false,

                copySuccess: false,

                permConfigs: [],

                disabledOptions: 0,

                showAdderVisitor: false,

                permissionEdited: false,

                displayErrCode: undefined,

                errCode: undefined,

                showLoading: true,

                showCSF: false,

                showCSFTipDialog: false,

                csfTextArray: []

            }, () => {
                this.checkAllShareConfig(doc)
            })
        }
    }

    /**
     * 关闭“707研究所权限配置成功后-弹出部分用户密级不足已自动过滤相关文件” 窗口
     */
    private closeCSFTip() {
        this.setState({
            showCSFTipDialog: false
        })
    }

    render() {
        const {
            permConfigs,
            showShare,
            errCode,
            showAdderVisitor,
            displayErrCode,
            permissionEdited,
            open,
            showLoading,
            showPermDetail,
            currentConfig,
            disabledOptions,
            apvCase,
            showCSF,
            csfTextArray,
            showCSFTipDialog
         } = this.state;

        return (
            <div>
                <Drawer
                    open={open}
                    className={styles['drawer']}
                    position="right"
                >
                    {
                        showShare ?
                            <div className={styles['container']}>
                                <div className={styles['fixed-area']}>
                                    <AppBar>
                                        <div className={styles['header-left-area']}>
                                            <div
                                                className={classnames(styles['header-enable-btn'], styles['header-button'])}
                                                onClick={this.handleCloseMobile.bind(this)}
                                            >
                                                {__('取消')}
                                            </div>
                                        </div>
                                        <div className={styles['header-text']}>{__('内链共享')}</div>
                                        <div className={styles['header-right-area']}>
                                            <div
                                                className={classnames(
                                                    styles['header-button'],
                                                    permissionEdited ? styles['header-enable-btn'] : styles['header-disabled-btn']
                                                )}
                                                onClick={permissionEdited ? () => this.setPermissions(this.doc, 'mobile') : noop}
                                            >
                                                {__('保存')}
                                            </div>
                                        </div>
                                    </AppBar>
                                    <div className={styles['path-area']}>
                                        <input
                                            className={styles['text-area']}
                                            value={this.filePath}
                                            contentEditable={false}
                                            onClick={this.selectAll.bind(this)}
                                        />
                                    </div>
                                    {
                                        displayErrCode ?
                                            null
                                            :
                                            <div
                                                className={styles['add-visitor-text']}
                                                onClick={() => this.setState({ showAdderVisitor: true })}
                                            >
                                                <div className={styles['add-visitor-text']}>
                                                    {__('添加访问者')}
                                                </div>
                                                <UIIcon
                                                    className={styles['icon']}
                                                    code={'\uf04e'}
                                                    size={24}
                                                    color={'#aaa'}
                                                />
                                            </div>
                                    }
                                </div>
                                {
                                    permConfigs.length ?
                                        <div className={styles['permissions']}>
                                            <SharePermissions
                                                showCSF={showCSF}
                                                csfTextArray={csfTextArray}
                                                permConfigs={permConfigs}
                                                disabledOptions={disabledOptions}
                                                allowPerms={this.template ? this.template.allowPerms : 0}
                                                onRemove={this.removeConfig.bind(this)}
                                                onViewPermDetail={(config) => this.setState({ showPermDetail: true, currentConfig: config })}
                                            />
                                        </div>
                                        : null
                                }
                                {
                                    displayErrCode ?
                                        <div className={styles['error-tip']}>
                                            {formatterErrorText(displayErrCode)}
                                        </div>
                                        : null
                                }
                                {
                                    showAdderVisitor ?
                                        <div className={styles['visitor-adder-component']}>
                                            <VisitorAdder
                                                showCSF={showCSF}
                                                csfTextArray={csfTextArray}
                                                onCancel={() => this.setState({ showAdderVisitor: false })}
                                                onAddVisitor={(visitorsNewAdded) => {
                                                    this.addPermConfig(visitorsNewAdded, 'mobile');
                                                    this.toggleVisitorAdderVisible(false);
                                                }}
                                            />
                                        </div>
                                        : null
                                }
                                {
                                    errCode ?
                                        <ErrorMessages
                                            onConfirmError={() => this.setState({ errCode: undefined })}
                                            errCode={errCode}
                                            doc={this.doc}
                                            template={this.newLinkTemplate}
                                        />
                                        : null
                                }
                                {
                                    apvCase && (
                                        <ErrorMessages
                                            onConfirmError={() => this.setState({ apvCase: false })}
                                            errCode={Status.ShareBeAudited}
                                            doc={this.doc}
                                            template={this.newLinkTemplate}
                                        />
                                    )
                                }
                                {
                                    showPermDetail ?
                                        <AdvancedPermissionsConfig
                                            template={this.template}
                                            secretMode={this.secretMode}
                                            allow={currentConfig.allow}
                                            deny={currentConfig.deny}
                                            isowner={currentConfig.isowner}
                                            endtime={currentConfig.endtime}
                                            accessorName={formatterName(currentConfig.accessorname)}
                                            allowPerms={this.template ? this.template.allowPerms : 0}
                                            disabledOptions={disabledOptions}
                                            showDeny={true}
                                            allowOwner={currentConfig.allowOwner}
                                            onCancel={() => this.setState({
                                                showPermDetail: false
                                            })}
                                            onChange={(perm, endtime) => this.editConfig(currentConfig.accessorid + currentConfig.inheritpath, { ...currentConfig, ...perm }, endtime)}
                                        />
                                        : null
                                }
                                {
                                    showLoading ?
                                        <ProgressCircle />
                                        : null
                                }
                            </div>
                            :
                            null
                    }
                </Drawer>
                {
                    !showShare && errCode ?
                        <ErrorMessages
                            onConfirmError={this.handleCloseMobile.bind(this)}
                            errCode={errCode}
                            doc={this.doc}
                            template={this.newLinkTemplate}
                        />
                        : null
                }
                {
                    showLoading ?
                        <ProgressCircle />
                        : null
                }
                {
                    showCSFTipDialog && (
                        <MessageDialog onConfirm={this.closeCSFTip.bind(this)}>
                            {'部分用户密级不足，已自动过滤高密级文件。'}
                        </MessageDialog>
                    )
                }
            </div>
        )
    }
}