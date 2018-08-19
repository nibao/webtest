import * as React from 'react';
import * as classnames from 'classnames';
import { positiveInteger } from '../../../util/validators/validators';
import { docname } from '../../../core/docs/docs';
import { getSelectionTimeRange } from '../../../core/permission/permission';
import { shrinkText } from '../../../util/formatters/formatters';
import QRCode from '../../../ui/QRCode/ui.desktop';
import LinkChip from '../../../ui/LinkChip/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import { getIcon } from '../../helper';
import ValidityBox2 from '../../ValidityBox2/component.desktop';
import CopyLink from '../../CopyLink/component.desktop';
import PermConfig from '../PermConfig/component.desktop';
import Switch from '../Switch/component.desktop';
import Mail from '../Mail/component.desktop';
import { Status } from '../helper';
import __ from './locale';
import * as styles from './styles.desktop.css';


const ConfigurationView: Component.LinkShare.Confirguration.View = function ConfigurationView({
    swf,
    doc,
    status,
    address,
    enableLinkAccessCode,
    link,
    password,
    endtime,
    limited,
    limitation,
    accesscode,
    template,
    perm,
    mailto,
    opening,
    closing,
    showButtons,
    doSave,
    doCancel,
    onSwitchStatus,
    onPermChange,
    onPasswordChange,
    onEndtimeChange,
    onLimitedChange,
    onLimitationChange,
    onMailsChange,
    onMailSendSuccess,
    onMailSendError,
    onViewFullImage,
    onShowDownloadDialog,
    doCopy,
}) {
    return (
        <Panel>
            <Panel.Main>
                <div className={styles['linkInfo']}>
                    <FlexBox>
                        <FlexBox.Item align="left middle">
                            <div>
                                {
                                    getIcon(doc)
                                }
                                <span className={styles.docname} title={docname(doc)}>
                                    {
                                        shrinkText(docname(doc), { limit: 40 })
                                    }
                                </span>
                            </div>
                        </FlexBox.Item>
                        <FlexBox.Item align="right middle">
                            <Switch
                                status={status}
                                enableLinkAccessCode={enableLinkAccessCode}
                                onSwitch={onSwitchStatus}
                                opening={opening}
                                closing={closing}
                            />
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                {
                    status === Status.OPEN ? (
                        <div>
                            <div className={styles['block']}>
                                <FlexBox>
                                    <FlexBox.Item align="left middle">
                                        {
                                            accesscode ?
                                                __('提取码：') :
                                                __('外链地址：')
                                        }
                                    </FlexBox.Item>
                                    <FlexBox.Item align="right middle">
                                        <CopyLink
                                            enableLinkAccessCode={enableLinkAccessCode}
                                            swf={swf}
                                            link={link}
                                            accesscode={accesscode}
                                            endtime={endtime}
                                            password={password}
                                            doCopy={doCopy}
                                        />
                                    </FlexBox.Item>
                                </FlexBox>
                            </div>
                            <div className={styles['block']}>
                                <FlexBox>
                                    <FlexBox.Item>
                                        <div className={styles['config']}>
                                            <Form>
                                                <Form.Row>
                                                    <Form.Label>
                                                        <label>{__('访问权限：')}</label>
                                                    </Form.Label>
                                                    <Form.Field>
                                                        <PermConfig
                                                            doc={doc}
                                                            template={template}
                                                            perm={perm}
                                                            onPermChange={onPermChange}
                                                        />
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        <label>{__('有效期限：')}</label>
                                                    </Form.Label>
                                                    <Form.Field>
                                                        <ValidityBox2
                                                            value={endtime}
                                                            selectRange={getSelectionTimeRange(template.validExpireDays ? template.maxExpireDays : 0)}
                                                            onChange={onEndtimeChange}
                                                        />
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        <CheckBoxOption
                                                            onChange={onPasswordChange}
                                                            checked={!!password}
                                                            disabled={!!password && template.enforceUseLinkPwd}
                                                        >
                                                            {__('访问密码：')}
                                                        </CheckBoxOption>
                                                    </Form.Label>
                                                    <Form.Field>
                                                        <TextBox
                                                            disabled={!password}
                                                            value={password}
                                                            readOnly={true}
                                                        />
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        <CheckBoxOption
                                                            onChange={onLimitedChange}
                                                            value={limited}
                                                            checked={limited}
                                                            disabled={limited && template.limitAccessTime}
                                                        >
                                                            {__('限制打开次数：')}
                                                        </CheckBoxOption>
                                                    </Form.Label>
                                                    <Form.Field>
                                                        <TextBox
                                                            disabled={!limited}
                                                            onChange={onLimitationChange}
                                                            value={limitation}
                                                            validator={positiveInteger}
                                                        />
                                                    </Form.Field>
                                                </Form.Row>
                                            </Form>
                                            <div className={classnames(styles['block'], { [styles['invisible']]: !showButtons })} >
                                                <div className={styles['buttonWrapper']}>
                                                    <Button
                                                        type="submit"
                                                        onClick={doSave}
                                                        disabled={perm === 0 || (limited && !limitation)}
                                                    >
                                                        {
                                                            __('保存')
                                                        }
                                                    </Button>
                                                </div>
                                                <div className={styles['buttonWrapper']}>
                                                    <Button onClick={doCancel}>{__('取消')}</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexBox.Item>
                                    <FlexBox.Item>
                                        <div className={styles['scan']}>
                                            <QRCode text={address} cellSize={3} />
                                            <div>
                                                <LinkChip className={styles['qrcode-action']} onClick={onViewFullImage}>{__('查看原图')}</LinkChip>
                                                <LinkChip className={styles['qrcode-action']} onClick={onShowDownloadDialog}>{__('下载二维码')}</LinkChip>
                                            </div>
                                        </div>
                                    </FlexBox.Item>
                                </FlexBox>
                            </div>
                            <div className={styles['shareOptions']}>
                                <Mail
                                    doc={doc}
                                    link={link}
                                    accesscode={accesscode}
                                    password={password}
                                    endtime={endtime}
                                    enableLinkAccessCode={enableLinkAccessCode}
                                    mailto={mailto}
                                    onMailsChange={onMailsChange}
                                    onMailSendSuccess={onMailSendSuccess}
                                    onMailSendError={onMailSendError}
                                />
                            </div>
                        </div>
                    ) : null
                }
            </Panel.Main>
        </Panel>
    )
}

export default ConfigurationView;