import * as React from 'react';
import { noop } from 'lodash';
import Panel from '../../../ui/Panel/ui.desktop';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import Icon from '../../../ui/Icon/ui.desktop';
import { formatSize } from '../../../util/formatters/formatters';
import * as loading from '../assets/images/loading.gif'
import * as styles from './styles.desktop.css';
import __ from './locale';


export default function View({ isQuering = true, onConfirm = noop, onCancel = noop, filenum, dirnum, totalsize, recyclesize, onlyrecycle }: Components.ViewSize.Content.Props) {
    return (
        <Panel>
            <Panel.Main>
                {
                    !isQuering ?
                        <div className={styles['container']}>
                            <div className={styles['head']}>
                                {__('对于您选中的文档，统计结果如下：')}
                            </div>
                            <Form>
                                <Form.Row>
                                    <Form.Label>{__('总文件数：')}</Form.Label>
                                    <Form.Field>
                                        {filenum}
                                        {__('个')}
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                            <Form>
                                <Form.Row>
                                    <Form.Label>{__('总文件夹数：')}</Form.Label>
                                    <Form.Field>
                                        {dirnum}
                                        {__('个')}
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                            <Form>
                                <Form.Row>
                                    <Form.Label>{__('总大小：')}</Form.Label>
                                    <Form.Field>
                                        {formatSize(totalsize)}
                                    </Form.Field>
                                    {
                                        !onlyrecycle && recyclesize > -1 ?
                                            <span className={styles['recycle-size']}>
                                                {__('其中回收站文件大小：')}
                                                {formatSize(recyclesize)}
                                            </span>
                                            : null
                                    }
                                </Form.Row>
                            </Form>
                        </div>
                        :
                        <div className={styles['loading-container']}>
                            <FlexBox>
                                <FlexBox.Item align={'center middle'}>
                                    <div className={styles['loading-box']} >
                                        <Icon url={loading} />
                                        <div className={styles['loading-message']}>
                                            {__('正在统计......')}
                                        </div>
                                    </div>
                                </FlexBox.Item>
                            </FlexBox>
                        </div>
                }
            </Panel.Main>
            <Panel.Footer>
                {
                    !isQuering ?
                        <Panel.Button type="submit" onClick={onConfirm}>{__('确定')}</Panel.Button>
                        :
                        <Panel.Button type="submit" onClick={onCancel}>{__('取消')}</Panel.Button>
                }
            </Panel.Footer>
        </Panel>
    )
}