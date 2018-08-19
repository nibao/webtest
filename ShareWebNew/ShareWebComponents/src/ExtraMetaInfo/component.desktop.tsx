import * as React from 'react';
import { map, assign, cloneDeep } from 'lodash';
import { number } from '../../util/validators/validators';
import { isEmpty } from '../../util/accessor/accessor';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import TextArea from '../../ui/TextArea/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import CascadeArea from '../../ui/CascadeArea/ui.desktop';
import ClockBox from '../../ui/ClockBox/ui.desktop';
import Text from '../../ui/Text/ui.desktop'
import AttrTextField from '../../ui/AttrTextField/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import AttributesPicker from '../AttributesPicker/component.desktop';
import EnumPicker from '../EnumPicker/component.desktop';
import * as styles from './styles.desktop.css';
import ExtraMetaInfoBase from './component.base';
import { AttrType } from './helper';
import __ from './locale';

export default class ExtraMetaInfo extends ExtraMetaInfoBase {
    render() {
        return (
            !isEmpty(this.state.displayedAttrs) ?
                (
                    <div className={styles['container']}>
                        <h1 className={styles['title']}>
                            <label>{__('更多属性')}</label>
                            {
                                this.renderEditBtn()
                            }
                        </h1>

                        <div className={styles['content-padding']}>
                            <div className={styles['meta-block']}>
                                {
                                    this.renderAttr()
                                }
                            </div>
                        </div>
                        {
                            this.state.showEditDialog ? this.renderEditDialog() : null
                        }
                        {
                            this.state.errorMsg ? this.renderError() : null
                        }
                    </div>
                )
                : null
        )
    }

    renderAttr() {
        return (
            <div>
                {
                    map(this.state.displayedAttrs, attr => {
                        return <AttrTextField attr={attr} />
                    })
                }
            </div>
        )
    }

    renderEditField(attr) {
        switch (attr.type) {
            case AttrType.LEVEL:
                return (
                    <AttributesPicker
                        attributeId={attr.id}
                        onlySelectLeaf={true}
                        onSelect={(value) => this.setLevel(attr.id, value)}
                        path={attr.value}
                        onLoad={(value) => this.setLevel(attr.id, value)}
                        />
                )

            case AttrType.ENUM:
                return (
                    <EnumPicker
                        attributeId={attr.id}
                        name={attr.value && attr.value.length ? attr.value[0] : attr.option && attr.option.name ? attr.option.name : undefined}
                        onSelect={(value) => this.setEnum(attr.id, value)}
                        onLoad={(value) => this.loadEnum(attr, value)}
                        />
                )

            case AttrType.NUMBER:
                return (
                    <TextBox value={attr.value || ''} validator={this.validateNumer} onChange={val => this.setNumber.bind(this)(attr.id, val)} />
                )

            case AttrType.TEXT:
                return (
                    <TextArea
                        value={attr.value}
                        width={220}
                        height={80}
                        validator={this.validateText.bind(this)}
                        onChange={val => this.setText.bind(this)(attr.id, val)}
                        placeholder={__('最多可输入140字')}
                        maxLength={140}
                        />
                )

            case AttrType.TIME:
                return (
                    <ClockBox seconds={attr.value} onChange={val => this.setTime.bind(this)(attr.id, val)} />
                )
        }
    }


    renderEditDialog() {
        return (
            <Dialog
                title={__('编辑更多属性')}
                onClose={this.closeEditDialog.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['edit-content']}>
                            <Form>
                                {
                                    map(this.state.attrs, (attr, i) => {
                                        return (
                                            <Form.Row>
                                                <Form.Label>
                                                    <div className={styles['name-container']}>
                                                        <Text className={styles['attr-name']}>{attr.name}</Text>
                                                        {'：'}
                                                    </div>
                                                </Form.Label>
                                                <Form.Field>
                                                    <div className={styles['value']} style={{ zIndex: this.state.attrs.length - i }}>
                                                        {
                                                            this.renderEditField(attr)
                                                        }
                                                    </div>
                                                </Form.Field>
                                            </Form.Row>
                                        )
                                    })
                                }
                            </Form>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button type="submit" onClick={this.saveAttrs.bind(this)}>{__('确定')}</Panel.Button>
                        <Panel.Button onClick={this.closeEditDialog.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }

    renderEditBtn() {
        if (this.state.showEditBtn) {
            return (
                <Button
                    className={styles['edit-tag-btn']}
                    minWidth={60}
                    onClick={this.showEditDialog.bind(this)}
                    >
                    {__('编辑')}
                </Button>
            )
        }

    }

    renderError() {
        return (
            <MessageDialog onConfirm={this.resetError.bind(this)}>
                <p>{this.state.errorMsg}</p>
            </MessageDialog>
        )
    }

}