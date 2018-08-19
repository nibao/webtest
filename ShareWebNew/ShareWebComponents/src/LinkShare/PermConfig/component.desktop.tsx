import * as React from 'react';
import { bitTest } from '../../../util/accessor/accessor';
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import {  LinkSharePermission } from '../../../core/permission/permission';
import { isDir } from '../../../core/docs/docs';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default function PermConfig({ doc, template: { allowPerms }, perm, onPermChange }) {
    return (
        <FlexBox>
            {
                bitTest(allowPerms, LinkSharePermission.PREVIEW) || bitTest(perm, LinkSharePermission.PREVIEW) ?
                    <FlexBox.Item>
                        <div className={ styles['option'] }>
                            <CheckBoxOption
                                checked={ bitTest(perm, LinkSharePermission.PREVIEW) }
                                value={ LinkSharePermission.PREVIEW }
                                onChange={ checked => { onPermChange(checked, LinkSharePermission.PREVIEW) } }
                            >
                                {
                                    __('预览')
                                }
                            </CheckBoxOption>
                        </div>
                    </FlexBox.Item> : null
            }
            {
                bitTest(allowPerms, LinkSharePermission.DOWNLOAD) || bitTest(perm, LinkSharePermission.DOWNLOAD) ?
                    <FlexBox.Item>
                        <div className={ styles['option'] }>
                            <CheckBoxOption
                                checked={ bitTest(perm, LinkSharePermission.DOWNLOAD) }
                                value={ LinkSharePermission.DOWNLOAD }
                                onChange={ checked => { onPermChange(checked, LinkSharePermission.DOWNLOAD) } }
                            >
                                {
                                    __('下载')
                                }
                            </CheckBoxOption>
                        </div>
                    </FlexBox.Item> : null
            }
            {
                (bitTest(allowPerms, LinkSharePermission.UPLOAD) || bitTest(perm, LinkSharePermission.UPLOAD)) && isDir(doc) ?
                    <FlexBox.Item>
                        <div className={ styles['option'] }>
                            <CheckBoxOption
                                checked={ bitTest(perm, LinkSharePermission.UPLOAD) }
                                value={ LinkSharePermission.UPLOAD }
                                onChange={ checked => { onPermChange(checked, LinkSharePermission.UPLOAD) } }
                            >
                                {
                                    __('上传')
                                }
                            </CheckBoxOption>
                        </div>
                    </FlexBox.Item> : null
            }
        </FlexBox>
    )
}