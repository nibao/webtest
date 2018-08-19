import * as React from 'react';
import Button from '../../../ui/Button/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import GroupManageItem from '../GroupManage.Item/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop';

export default class GroupView extends React.Component<Components.Groups.GropViewProps, any>{
    render() {
        const {
            data,
            onCreate,
            creating,
            warning,
            activeId,
            computeMaxSize,
            onEdit,
            onSave,
            onDel,
            onCancle,
            onError,
            onConfirmCreate
        } = this.props;
        return (
            <Panel>
                <Panel.Main>
                    <div className={styles['main-header']}>
                        <Button
                            className={styles['create-button']}
                            onClick={onCreate}
                        >
                            <UIIcon
                                code="\uf089"
                                className={styles['createIcon']}
                                size={12}
                            />
                            <span className={styles['button-text']} >
                                {__('创建群组文档')}
                            </span>
                        </Button>
                    </div>
                    <div
                        className={styles['main-body']}
                        ref="list"
                    >
                        <div className={styles['body-list']}>
                            {
                                creating ?
                                    <GroupManageItem
                                        data={{
                                            docname: '',
                                            used: 0,
                                            quota: '',
                                            docid: 'create'
                                        }}
                                        key="create"
                                        index={0}
                                        activeId={activeId}
                                        onSave={onConfirmCreate}
                                        onCancle={onCancle}
                                        warning={creating && warning}
                                        onError={onError}
                                        maxSize={computeMaxSize('creating')}
                                    /> : null
                            }
                            {
                                data.length ?
                                    data.map((item, index) => {
                                        return (
                                            <GroupManageItem
                                                data={item}
                                                key={item.docid}
                                                index={creating ? index + 1 : index}
                                                activeId={activeId}
                                                onEdit={onEdit}
                                                onSave={onSave}
                                                onDel={onDel}
                                                onCancle={onCancle}
                                                onError={onError}
                                                warning={(activeId === item.docid) && warning}
                                                maxSize={computeMaxSize(item.docid)}
                                            />
                                        )
                                    }) : (
                                        !creating ?
                                            <p className={styles['noGroupTip']}>{__('您可以通过群组文档与一个临时项目组成员进行共享协作。')}</p> : null
                                    )
                            }
                        </div>
                    </div>
                </Panel.Main>
            </Panel>
        )
    }
}