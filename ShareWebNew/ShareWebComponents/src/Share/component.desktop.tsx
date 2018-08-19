import * as React from 'react';
import * as classnames from 'classnames';
import { Status } from '../../core/permission/permission'
import Panel from '../../ui/Panel/ui.desktop'
import Dialog from '../../ui/Dialog2/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import Overlay from '../../ui/Overlay/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import ClipboardButton from '../../ui/ClipboardButton/ui.desktop';
import VisitorSearcher from '../VisitorSearcher/component.desktop';
import VisitorAdder from '../VisitorAdder/component.desktop';
import SharePermissions from '../Share.Permissions/component.desktop';
import ShareBase from './component.base';
import ApvCaseDialog from './ApvCaseDialog/component.desktop';
import ErrorMessages from './ErrorMessages/component.desktop';
import SecretModeMessages from './SecretModeMessages/component.desktop';
import * as styles from './styles.desktop';
import __ from './locale';

export default class Share extends ShareBase {
    render() {
        const { permConfigs, showShare, errCode, apvCase, secretMode, copySuccess, disabledOptions, showAdderVisitor, displayErrCode } = this.state;
        return (
            <div>
                {
                    showShare ?
                        <Dialog
                            width={770}
                            title={this.props.title ? this.props.title : __('内链共享')}
                            onClose={this.props.onCloseDialog}
                        >
                            <Panel>
                                <Panel.Main>
                                    <div className={styles['wrapper']}>
                                        <Form>
                                            <Form.Row>
                                                <Form.Label>
                                                    <label className={styles['label-width']} >
                                                        {__('文档路径：')}
                                                    </label>
                                                </Form.Label>
                                                <Form.Field>
                                                    <TextBox
                                                        className={styles['text-input']}
                                                        width={496}
                                                        readOnly={true}
                                                        value={this.filePath}
                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    {
                                                        this.props.doCopyLink ?
                                                            <Button
                                                                className={styles['btn']}
                                                                onClick={() => this.props.doCopyLink(this.filePath)}
                                                            >
                                                                {__('复制链接')}
                                                            </Button> :
                                                            <ClipboardButton
                                                                className={styles['btn']}
                                                                text={this.filePath}
                                                                swf={this.props.swf}
                                                                afterCopy={() => this.copyLinkSuccess()}
                                                            >
                                                                {__('复制链接')}
                                                            </ClipboardButton>
                                                    }
                                                </Form.Field>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label>
                                                    <label className={styles['label-width']}>
                                                        {__('添加访问者：')}
                                                    </label>
                                                </Form.Label>
                                                <Form.Field>
                                                    {
                                                        displayErrCode ?
                                                            <TextBox
                                                                className={styles['text-input']}
                                                                width={496}
                                                                disabled={true}
                                                            /> :
                                                            <div className={classnames(styles['text-input'], styles['visitor-searcher'])}>
                                                                <VisitorSearcher
                                                                    width={496}
                                                                    onSelect={(data) => this.addPermConfig([data])}
                                                                />
                                                            </div>
                                                    }
                                                </Form.Field>
                                                <Form.Field>
                                                    <Button
                                                        className={styles['btn']}
                                                        disabled={displayErrCode}
                                                        onClick={() => this.toggleVisitorAdderVisible(true)}
                                                    >
                                                        {__('添加更多')}
                                                    </Button>
                                                </Form.Field>
                                            </Form.Row>
                                        </Form>
                                        <SharePermissions
                                            displayErrCode={displayErrCode}
                                            permConfigs={permConfigs}
                                            disabledOptions={disabledOptions}
                                            allowPerms={this.template ? this.template.allowPerms : 0}
                                            allowOwner={this.template ? this.template.allowOwner : false}
                                            onRemove={this.removeConfig.bind(this)}
                                            onChange={this.editConfig.bind(this)}
                                            doctype={this.doctype}
                                        />
                                    </div>
                                    {
                                        showAdderVisitor ?
                                            <VisitorAdder
                                                onAddVisitor={(visitorsNewAdded) => { this.addPermConfig(visitorsNewAdded); this.toggleVisitorAdderVisible(false) }}
                                                onCancel={() => this.toggleVisitorAdderVisible(false)}
                                            />
                                            :
                                            null
                                    }
                                    {
                                        secretMode ?
                                            <SecretModeMessages
                                                onCancel={this.toggleSectedMode.bind(this, false)}
                                                onConfirm={() => { this.setPermissions(); this.setState({ secretMode: false }) }}
                                                csflevelText={this.csflevelText}
                                                doc={this.doc}
                                            />
                                            : null
                                    }
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button
                                        type="submit"
                                        onClick={() => this.confirm()}
                                    >
                                        {__('确定')}
                                    </Panel.Button>
                                    <Panel.Button
                                        onClick={() => this.props.onCloseDialog()}
                                    >
                                        {__('取消')}
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        : null
                }
                {
                    apvCase
                        ? <ApvCaseDialog
                            onConfirm={() => { this.setState({ apvCase: false }); this.props.onCloseDialog() }}
                            doApvJump={() => { this.props.doApvJump(); this.props.onCloseDialog() }}
                        />
                        : null
                }
                {
                    errCode
                        ? <ErrorMessages
                            onConfirmError={() => showShare ? this.setState({ errCode: undefined }) : this.props.onCloseDialog()}
                            errCode={errCode}
                            doc={this.doc}
                            template={this.newLinkTemplate}
                        />
                        : null
                }
                {
                    copySuccess ?
                        <Overlay position="top center">
                            {__('链接已复制。')}
                        </Overlay>
                        :
                        null
                }
            </div>
        )
    }
} 