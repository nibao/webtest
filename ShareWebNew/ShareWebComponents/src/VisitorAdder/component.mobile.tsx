import * as React from 'react'
import { getRoots } from '../../core/department/department'
import LayerGroup from '../../ui/LayerGroup/ui.mobile'
import Text from '../../ui/Text/ui.mobile'
import UIIcon from '../../ui/UIIcon/ui.mobile'
import List from '../../ui/List2/ui.mobile'
import AppBar from '../../ui/AppBar/ui.mobile'
import ToolButton from './ToolButton/component.mobile'
import VisitorAdderBase from './component.base'
import * as styles from './styles.mobile'
import __ from './locale'

export default class VisitorAdder extends VisitorAdderBase {

    async componentWillMount() {
        const roots = await getRoots()

        this.setState({
            layers: ['roots'],
            childrens: [roots]
        })
    }

    render() {
        const { layers, childrens, checkedInfos } = this.state

        return (
            layers.length ?
                <div className={styles['container']}>
                    <AppBar>
                        <div className={styles['header-left-area']}>
                            <UIIcon
                                className={styles['header-left-button']}
                                code={'\uf04d'}
                                size={'1rem'}
                                color={'#d70000'}
                                onClick={() => this.goBackToLastLayer()}
                            />
                        </div>
                        <div
                            className={styles['header-text']}
                        >
                            {layers.length === 1 ? __('添加访问者') : layers[layers.length - 1].name}
                        </div>
                    </AppBar>
                    <div className={styles['layer-group']}>
                        <LayerGroup>
                            {
                                layers.map((layer, index) => this.generateLayer(childrens, index, checkedInfos))
                            }
                        </LayerGroup>
                    </div>
                    <ToolButton
                        className={styles['bottom-tool']}
                        selectNums={checkedInfos.length}
                        onCancel={this.props.onCancel}
                        onConfirm={checkedInfos.length ? (() => this.props.onAddVisitor(this.state.checkedInfos)) : undefined}
                    />
                </div>
                : null
        )
    }

    generateLayer(childrens, index, checkedInfos) {
        return (
            <LayerGroup.Layer>
                <List>
                    {
                        childrens[index].map(item => (
                            <List.Item
                                checkbox={{
                                    disabled: item.depid ? !item.isconfigable : false,
                                    onChange: (checked) => this.handleSelectChange(item, checked),
                                    checked: this.checked(item, checkedInfos)
                                }}
                                rightIcon={
                                    item.depid ?
                                        <UIIcon
                                            code={'\uf04e'}
                                            size={24}
                                            onClick={() => this.enterDep(item)}
                                        />
                                        :
                                        undefined
                                }
                                onClick={() => this.enterDep(item)}
                            >
                                <Text className={styles['item']}>
                                    <UIIcon
                                        className={styles['icon']}
                                        code={index === 0 ? '\uf008' : (item.depid ? '\uf009' : '\uf007')}
                                        size={24}
                                    />
                                    <span className={styles['text']}>
                                        {this.formatterName(item)}
                                    </span>
                                </Text>
                            </List.Item>
                        ))
                    }
                </List>
            </LayerGroup.Layer >
        )
    }

    /**
     * 检查info是否勾选
     */
    checked(info, checkedInfos): boolean {
        return checkedInfos.some(item => (info.depid ? info.depid : info.userid) === (item.depid ? item.depid : item.userid))
    }

    /**
     * 获取显示名字
     * @param config 
     */
    private formatterName(config: any) {
        if (this.props.showCSF && config.csflevel) {
            // 707研究所 权限配置 ，用户后面加上密级。前提条件：开启控制该功能的后台开关（此开关在其他时候都默认关闭），且开启涉密模式，且不开启共享审核机制
            return `${config.name}(${this.props.csfTextArray[config.csflevel - 5]})`
        }

        return config.name
    }
}