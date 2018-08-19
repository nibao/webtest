import * as React from 'react'
import * as classnames from 'classnames'
import DocLibSelectorBase, { DocLibType } from './component.base'
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Tabs from '../../ui/Tabs/ui.desktop'
import LazyLoader from '../../ui/LazyLoader/ui.desktop'
import UIIcon from '../../ui/UIIcon/ui.desktop'
import Icon from '../../ui/Icon/ui.desktop'
import Button from '../../ui/Button/ui.desktop'
import SearchBox from '../../ui/SearchBox/ui.desktop'
import Text from '../../ui/Text/ui.desktop'
import __ from './locale'
import * as styles from './styles.view.css'
import * as docLibImg from './assets/images/doclib.png'

export default class DocLibSelector extends DocLibSelectorBase {
    render() {
        let { libs, selected, values } = this.state,
            { docLibs } = this.props,
            docLibLabels = {
                [DocLibType.DocLib]: __('文档库'),
                [DocLibType.ArchiveLib]: __('归档库')
            }
        return (
            <Dialog
                title={__('添加文档库')}
                buttons={[]}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['container']}>
                            <div className={classnames(styles['fl'], styles['doclib-wrapper'])}>
                                <Tabs>
                                    <Tabs.Navigator>
                                        {
                                            docLibs.map((docLibType, index) => <Tabs.Tab active={index === 0}>{docLibLabels[docLibType]}</Tabs.Tab>)
                                        }
                                    </Tabs.Navigator>
                                    <Tabs.Main>
                                        {
                                            docLibs.map(docLibType => (
                                                <Tabs.Content>
                                                    <div className={styles['doclibs']}>
                                                        <div className={styles['search-wrapper']}>
                                                            <SearchBox
                                                                className={styles['searchbox']}
                                                                width={288}
                                                                placeholder={__('搜索')}
                                                                value={values[docLibType]}
                                                                onChange={(value) => this.setState({ values: { ...values, [docLibType]: value } })}
                                                                loader={this.searchDocInfos(docLibType)}
                                                                onLoad={this.handleDocLibsLoaded.bind(this)}
                                                            />
                                                        </div>
                                                        <div className={styles['doclib-list']}>
                                                            <LazyLoader at={[0.75, () => this.lazyloader(docLibType)]} threshold={500} >
                                                                <ul>
                                                                    {
                                                                        libs[docLibType].map(lib => (
                                                                            <li className={styles['doclib-item']}>

                                                                                <a href="javascript:;" onClick={() => this.handleSelectDocLib(lib)}>
                                                                                    <div className={styles['doclib-content']}>
                                                                                        <Icon size="24" url={docLibImg} />
                                                                                        <span className={styles['doclib-name']} title={lib.name}>{lib.name}</span>
                                                                                    </div>
                                                                                </a>

                                                                            </li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </LazyLoader>
                                                        </div>
                                                    </div>
                                                </Tabs.Content>
                                            ))
                                        }
                                    </Tabs.Main>
                                </Tabs>
                            </div>
                            <div className={classnames(styles['fr'], styles['selected-wrapper'])}>
                                <div className={styles['selected-header']}>
                                    <span className={styles['doclib-name']}>{__('已选:')}</span>
                                    <Button onClick={this.handleClearSelected.bind(this)} className={styles['fr']} disabled={this.state.selected.length === 0} >{__('清空')}</Button>
                                </div>
                                <div className={styles['selected-list']}>
                                    <ul>
                                        {
                                            selected.map(lib => (
                                                <li className={styles['selected-item']}>
                                                    <Text className={styles['doclib-name']}>{lib.name}</Text>
                                                    <div className={classnames(styles['button-wrapper'])}>
                                                        <UIIcon color="#9a9a9a" code={'\uf013'} size="16px" onClick={() => this.handleDeleteDocLib(lib)} />
                                                    </div>
                                                </li>
                                            ))
                                        }

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button disabled={this.state.selected.length === 0} onClick={this.handleConfirm.bind(this)}>{__('确定')}</Panel.Button>
                        <Panel.Button onClick={this.handleCancel.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }
}