import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash'
import Panel from '../../../ui/Panel/ui.desktop'
import Dialog from '../../../ui/Dialog2/ui.client'
import Form from '../../../ui/Form/ui.desktop'
import Button from '../../../ui/Button/ui.desktop'
import TextBox from '../../../ui/TextBox/ui.desktop'
import ClipboardButton from '../../../ui/ClipboardButton/ui.desktop'
import VisitorSearcher from '../../VisitorSearcher/component.desktop'
import SharePermissions from '../../Share.Permissions/component.client'
import __ from './locale';
import * as styles from './styles.desktop';

const Config: React.StatelessComponent<Components.Share.Config.Props> = function Config({
    filePath = '',
    permConfigs = [],
    disabledOptions = 0,
    doctype,
    template,
    swf,
    onCopyLinkSuccess = noop,
    onClickMoreVisitors = noop,
    onAddPermConfigs = noop,
    displayErrCode,
    onRemoveConfig = noop,
    onEditConfig = noop,
    onCancel = noop,
    onConfirm = noop,
    doCopyLink
}) {
    return (
        <Dialog width={770}>
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
                                        value={filePath}
                                        />
                                </Form.Field>
                                <Form.Field>
                                    {
                                        doCopyLink ?
                                            <Button
                                                className={styles['btn']}
                                                onClick={() => doCopyLink(filePath)}
                                                >
                                                {__('复制链接')}
                                            </Button> :
                                            <ClipboardButton
                                                className={styles['btn']}
                                                text={filePath}
                                                swf={swf}
                                                afterCopy={onCopyLinkSuccess}
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
                                                    onSelect={(data) => onAddPermConfigs([data])}
                                                    />
                                            </div>
                                    }
                                </Form.Field>
                                <Form.Field>
                                    <Button
                                        className={styles['btn']}
                                        disabled={displayErrCode}
                                        onClick={onClickMoreVisitors}
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
                            allowPerms={template ? template.allowPerms : 0}
                            allowOwner={template ? template.allowOwner : false}
                            onRemove={onRemoveConfig}
                            onChange={onEditConfig}
                            doctype={doctype}
                            />
                    </div>
                </Panel.Main>
                <Panel.Footer>
                    <Panel.Button
                        type="submit"
                        onClick={onConfirm}
                        >
                        {__('确定')}
                    </Panel.Button>
                    <Panel.Button
                        onClick={onCancel}
                        >
                        {__('取消')}
                    </Panel.Button>
                </Panel.Footer>
            </Panel>
        </Dialog>
    )
}

export default Config