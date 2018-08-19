import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import DocListSiteBase from './component.base';
import { getErrorMessage } from '../../core/exception/exception';
import Select from '../../ui/Select/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { Status } from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class DocListSite extends DocListSiteBase {
    render() {
        return (
            <div>
                {
                    this.state.status === Status.Config ?
                        (
                            <Dialog
                                title={__('站点设置')}
                                onClose={this.props.onSiteSetComplete.bind(this)}
                            >
                                <Panel>
                                    <Panel.Main>
                                        <div>
                                            {
                                                ({ 'library': __ })[this.props.type]
                                            }
                                            {
                                                this.props.type === 'library' ?
                                                    __('将选中的文档库的归属站点设置为：') :
                                                    null
                                            }
                                            {
                                                this.props.type === 'archive' ?
                                                    __('将选中的归档库的归属站点设置为：') :
                                                    null
                                            }
                                        </div>
                                        <div className={styles['select-site']}>
                                            <Select
                                                value={this.state.selectedSite}
                                                onChange={value => { this.onSelectedSite(value) }}
                                                width={300}
                                                menu={{ width: 300 }}
                                            >
                                                {
                                                    this.state.siteInfos.map(site => {
                                                        return (
                                                            <Select.Option value={site} selected={this.state.selectedSite.id === site.id}>
                                                                {site.name}
                                                            </Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </Panel.Main>

                                    <Panel.Footer>
                                        <Panel.Button onClick={this.onConfirm.bind(this)}>
                                            {__('确定')}
                                        </Panel.Button>
                                        <Panel.Button onClick={this.props.onSiteSetComplete.bind(this)}>
                                            {__('取消')}
                                        </Panel.Button>
                                    </Panel.Footer>
                                </Panel>
                            </Dialog>
                        ) :
                        null
                }
                {
                    this.state.status === Status.Setting ?
                        (<ProgressCircle detail={`${__('正在设置站点，请稍后……')} ${this.state.progress}%`} />) :
                        null
                }
                {
                    this.state.errorStatus ?
                        (
                            <MessageDialog onConfirm={this.closeError.bind(this)}>
                                {
                                    getErrorMessage(this.state.errorStatus)
                                }
                            </MessageDialog>
                        ) :
                        null
                }
            </div>
        )
    }
}