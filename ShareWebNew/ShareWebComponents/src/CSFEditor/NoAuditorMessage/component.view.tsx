import * as React from 'react';
import { noop } from 'lodash';
import { docname } from '../../../core/docs/docs'
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import * as styles from './styles.desktop';
import __ from './locale';

const View: React.StatelessComponent<Components.Attributes.NoCsfAuditorMessage.Props> = function View({
    docs,
    currentDoc,
    onChange = noop
}) {

    return (
        <div>
            <div>
                {__('当前审核员对文档“${docName}”密级不足，本次操作无法生效，请联系管理员。', { docName: docname(currentDoc) })}
            </div>
            {
                docs.length > 1 ?
                    (
                        <div className={styles['checkbox-message']}>
                            <CheckBoxOption
                                checked={false}
                                onChange={onChange}
                                >
                                {__('跳过之后所有相同的冲突提示')}
                            </CheckBoxOption>
                        </div>
                    ) :
                    null
            }
        </div>
    )
}

export default View