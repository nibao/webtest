import * as React from 'react';
import * as classnames from 'classnames';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import ValidateArea from '../../ui/ValidateArea/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import UploadLimitationBase from './component.base';
import { IndexOfConfigType } from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';

export default class UploadLimitation extends UploadLimitationBase {
    render() {
        const TypeName = UploadLimitation.TypeName
        const ValidateState = UploadLimitationBase.ValidateState;
        const config = this.state.config;
        return (
            this.state.config.length ?
                <div className={styles['container']}>
                    <div className={styles['doc-type']}>
                        {__('不允许以下文件类型上传')}
                    </div>
                    <div className={styles['doc-zone']}>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Docs].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Docs)}
                                    >
                                        {__('文档类')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Docs].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Docs]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Docs].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Docs)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Videos].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Videos)}
                                    >
                                        {__('视频/音频')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Videos].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Videos]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Videos].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Videos)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Images].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Images)}
                                    >
                                        {__('图片')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Images].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Images]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Images].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Images)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Compression].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Compression)}
                                    >
                                        {__('压缩包')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Compression].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Compression]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Compression].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Compression)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Suspicion].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Suspicion)}
                                    >
                                        {__('可疑文件')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Suspicion].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Suspicion]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Suspicion].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Suspicion)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Viruses].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Viruses)}
                                    >
                                        {__('病毒文件')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Viruses].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Viruses]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Viruses].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Viruses)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <CheckBoxOption
                                        checked={config[IndexOfConfigType.Others].denyFlag}
                                        onChange={this.checkStatus.bind(this, TypeName.Others)}
                                    >
                                        {__('其他')}
                                    </CheckBoxOption>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateArea
                                        placeholder={__('请输入文件扩展名（如.doc），多个请用空格隔开')}
                                        value={config[IndexOfConfigType.Others].suffixes}
                                        validateState={this.state.validateStatus[TypeName.Others]}
                                        validateMessages={{
                                            [ValidateState.ErrEmpty]: __('此输入项不允许为空'),
                                            [ValidateState.ErrLength]: __('输入的扩展名字符过长或输入框内的扩展名个数不能超过300个，请重新输入'),
                                            [ValidateState.ErrType]: __('扩展名不能包含 \\ / : * ? " < > | 特殊字符或输入扩展名的格式不符，请重新输入')
                                        }}
                                        disabled={!config[IndexOfConfigType.Others].denyFlag}
                                        onChange={this.valueChanged.bind(this, TypeName.Others)}
                                        width={800}
                                        height={70}
                                        required={true}
                                    />
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </div>
                    {
                        this.state.visible ?
                            <div>
                                <span className={styles['btn-wrapper']}>
                                    <Button onClick={this.handleSave.bind(this)}>
                                        {__('保存')}
                                    </Button>
                                </span>
                                <Button onClick={this.handleCancel.bind(this)}>
                                    {__('取消')}
                                </Button>
                            </div>
                            : null
                    }
                </div> : null
        )
    }
}