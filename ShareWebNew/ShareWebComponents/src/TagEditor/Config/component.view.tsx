import * as React from 'react'
import * as classnames from 'classnames'
import { trim, uniq } from 'lodash'
import ConfigBase from './component.base'
import { getErrorMessage } from '../../../core/tag/tag'
import { docname } from '../../../core/docs/docs'
import { Panel, Form, Text, Button, AutoComplete, AutoCompleteList, Chip } from '../../../ui/ui.desktop'
import * as styles from './styles.view.css'
import __ from './locale'

export default class ConfigView extends ConfigBase {
    render() {
        const { value, results, maxTags, loader, onLoad, onUpdateValue, onEnter, onSelect, onAddTag, onRemoveTag, platform } = this.props

        const { showBorder, tags, errCode } = this.state

        return (
            <Panel>
                <Panel.Main>
                    <div className={styles['edit-tag-dialog']}>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>{__('文件名：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <Text className={classnames(styles['text'], styles['docname'])}>{docname(this.doc)}</Text>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    {__('标签：')}
                                </Form.Label>
                                <Form.Field>
                                    <AutoComplete
                                        ref={autocomplete => this.autocomplete = autocomplete}
                                        icon={null}
                                        width={212}
                                        value={value}
                                        autoFocus={true}
                                        missingMessage={__('未找到匹配的结果')}
                                        loader={loader}
                                        onLoad={onLoad}
                                        onChange={(value) => {
                                            this.setState({
                                                errCode: 0
                                            })
                                            onUpdateValue(value)
                                        }}
                                        validator={(value) => this.validator(value)}
                                        onEnter={(e, selectIndex) => {
                                            this.toggleAutocompleteActive(false)
                                            // 清空。当没有使用上下键选中某一项结果，且标签个数没有达到最大上限时，清空输入框的值    
                                            if (selectIndex < 0 && uniq([...tags, trim(value)]).length <= maxTags) {
                                                this.clearInput()
                                            }
                                            onEnter(e, selectIndex)
                                        }}
                                    >
                                        {
                                            (results && results.length) ? (
                                                <AutoCompleteList>
                                                    {
                                                        results.map((data) => (
                                                            <AutoCompleteList.Item key={data}>
                                                                <div onClick={() => {
                                                                    this.toggleAutocompleteActive(false)
                                                                    onSelect(data)
                                                                }}>
                                                                    <Text className={styles['item']}>
                                                                        {data}
                                                                    </Text>
                                                                </div>
                                                            </AutoCompleteList.Item>
                                                        ))
                                                    }
                                                </AutoCompleteList>
                                            ) : null
                                        }
                                    </AutoComplete>
                                    <Button
                                        className={styles['btn']}
                                        onClick={(e) => {
                                            // 清空。当标签个数没有达到最大上限时，清空输入框的值    
                                            if (uniq([...tags, trim(value)]).length <= maxTags) {
                                                this.clearInput()
                                            }

                                            onAddTag(e, -1)
                                        }}
                                        disabled={!trim(value)}
                                    >
                                        {__('添加')}
                                    </Button>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                        {
                            platform === 'desktop' ?
                                (
                                    (errCode && getErrorMessage(errCode, maxTags)) ?
                                        <div className={styles['error-desktop']}>
                                            {getErrorMessage(errCode, maxTags)}
                                        </div>
                                        :
                                        null
                                )
                                :
                                <div className={styles['error-field']}>
                                    {
                                        (errCode && !!getErrorMessage(errCode, maxTags)) ?
                                            <div className={styles['error-client']}>
                                                {getErrorMessage(errCode, maxTags)}
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                        }
                        <div
                            className={classnames(
                                styles['tags'],
                                showBorder ? styles['border'] : null,
                                platform === 'client' ? styles['client-area'] : styles['desktop-area']
                            )}
                            ref={tagsarea => this.tagsArea = tagsarea}
                        >
                            {
                                (tags && tags.length) ?
                                    tags.map((tag) => (
                                        <div className={styles['chip']}>
                                            <Chip removeHandler={() => onRemoveTag(tag)}>
                                                {tag}
                                            </Chip>
                                        </div>
                                    ))
                                    :
                                    null
                            }
                        </div>
                    </div>
                </Panel.Main>
            </Panel >
        )
    }
}