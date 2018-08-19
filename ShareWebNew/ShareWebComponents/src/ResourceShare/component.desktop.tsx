import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop';
import Tabs from '../../ui/Tabs/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import ShareCenter from '../ResourceShare.Center/component.desktop';
import ShareToPersonSpace from '../ResourceShare.PersonSpace/component.desktop';
import ShareToClassSpace from '../ResourceShare.ClassSpace/component.desktop';
import ResourceShareBase from './component.base';
import { ShareTip } from './help';
import * as styles from './styles.desktop.css';
import * as loading from './assets/loading.gif';

export default class ResourceShare extends ResourceShareBase {

    render() {

        const { params, tipDir, disableShare, showLoading, shareStatus, errorMsg, shareSlow } = this.state;
        let tipText = '';
        switch (shareStatus) {
            case ShareTip.LARGEFILE:
                tipText = '文件过大，分享需要时间较长，请耐心等待。。。'
                break;
            case ShareTip.SUCCESS:
                tipText = `您已成功分享文件到 ${tipDir}`;
                break;
            case ShareTip.ERROR:
                tipText = errorMsg;
                break;
            default:
                break;
        }
        return (
            <div className={styles['container']}>
                {
                    disableShare ?
                        <MessageDialog children={'请选择单个文件进行分享。'} onConfirm={() => { this.handleCancel(); } } />
                        :
                        <Dialog
                            draggable={!showLoading}
                            width={900}
                            title="将文件分享到"
                            onClose={() => { this.handleCancel(); } }
                            >
                            <Panel>
                                <Panel.Main >

                                    <Tabs height={450}>
                                        <Tabs.Navigator className={styles['nav']}>
                                            {[
                                                <Tabs.Tab active={true}>
                                                    个人空间
                                                </Tabs.Tab>,
                                                <Tabs.Tab>
                                                    班级空间
                                                </Tabs.Tab>,
                                                <Tabs.Tab>
                                                    资源中心
                                                </Tabs.Tab>
                                            ]}

                                        </Tabs.Navigator>

                                        <Tabs.Main>
                                            {[
                                                <Tabs.Content>
                                                    <ShareToPersonSpace onSourceTypeChange={this.handleSelectChange.bind(this)} />
                                                </Tabs.Content>,
                                                <Tabs.Content>
                                                    <ShareToClassSpace onClassChange={this.handleSelectChange.bind(this)} />
                                                </Tabs.Content>,
                                                <Tabs.Content>
                                                    <ShareCenter onUnitChange={this.handleSelectChange.bind(this)} />
                                                </Tabs.Content>

                                            ]}

                                        </Tabs.Main>
                                    </Tabs>

                                </Panel.Main>

                                <Panel.Footer>
                                    <Panel.Button
                                        type="submit"
                                        disabled={showLoading}
                                        onClick={() => { this.handleSubmit(); } }
                                        >
                                        确定
                                    </Panel.Button>

                                    <Panel.Button
                                        type="submit"
                                        onClick={() => { this.handleCancel(); } }
                                        >
                                        取消
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog >
                }
                {
                    showLoading ?
                        <div className={styles['loading']}>
                            <FlexBox>
                                <FlexBox.Item align={'center middle'}>
                                    <div className={styles['loading-box']} >
                                        <Icon url={loading} />
                                        <div className={styles['loading-message']}>{shareSlow ? '当前分享耗时较长，请耐心等待...' : '分享中，请稍候...'}</div>
                                    </div>
                                </FlexBox.Item>
                            </FlexBox>
                        </div> : null
                }
                {
                    shareStatus === ShareTip.SUCCESS ?
                        <SuccessDialog children={tipText} onConfirm={this.handleCloseTipDiaglog.bind(this)} />
                        : null
                }
                {
                    shareStatus === ShareTip.ERROR ?
                        <MessageDialog onConfirm={this.handleCloseTipDiaglog.bind(this)} >
                            {
                                tipText
                            }
                        </MessageDialog>
                        : null
                }
            </div>
        )
    }


}
