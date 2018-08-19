import * as React from 'react';
import * as classnames from 'classnames';
import Button from '../../../../../ui/Button/ui.desktop';
import PopMenu from '../../../../../ui/PopMenu/ui.desktop';
import Text from '../../../../../ui/Text/ui.desktop';
import Title from '../../../../../ui/Title/ui.desktop';
import TextInput from '../../../../../ui/TextInput/ui.desktop';
import PopMenuItem from '../../../../../ui/PopMenu.Item/ui.desktop';
import UIIcon from '../../../../../ui/UIIcon/ui.desktop';
import TagComboAreaBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class TagComboArea extends TagComboAreaBase {

    render() {

        let { tagInputWarning, tagKeys, tagInputKeys, isTagInput, tagInputFocus, tagInputAnchor, tagSuggestions, tagInputValue, isTagSuggestionShow } = this.state;

        return (
            <div className={styles['condition-tag-box']}>
                <ul className={styles['condition-tag-filters']}>
                    {
                        tagKeys.map((key) =>
                            <li className={styles['condition-tag-filter']}>
                                <span>{key}</span>
                                <UIIcon
                                    className={(styles['delete-icon'])}
                                    code={'\uf046'}
                                    size="14px"
                                    onClick={() => { this.handleDeleteTag(key) }}
                                >
                                </UIIcon>
                            </li>
                        )
                    }
                    {
                        !isTagInput && tagKeys.length + tagInputKeys.length < this.maxTagsCount ?
                            <Button
                                className={classnames(styles['condition-tag-add'])}
                                onClick={this.handleClickTagAddBtn.bind(this)}

                            >
                                <div className={classnames(styles['button-box'])}>
                                    <Title content={__('添加')}>
                                        <UIIcon
                                            className={classnames(styles['add-icon'])}
                                            code={'\uF089'}
                                            size="14px"
                                        >
                                        </UIIcon>
                                    </Title>
                                </div>
                            </Button>
                            : null
                    }
                    {
                        isTagInput ?
                            <div
                                className={styles['condition-tag-input-box']}
                                ref="tagInputBox"
                            >
                                <div
                                    className={classnames(styles['tag-input-content'],
                                        { [styles['tag-input-content-foucs']]: tagInputFocus, [styles['tag-input-content-warning']]: !tagInputFocus && tagInputWarning })}
                                    onFocus={(e) => { this.handleTagInputFocus(e) }}
                                    onBlur={(e) => { this.handleTagInputBlur(e) }}
                                    ref="tagInputContent"
                                >
                                    <ul
                                        className={styles['tag-input-filters']}
                                        ref="tagInputKeys"
                                    >
                                        {
                                            [...tagInputKeys].reverse().map((key) =>
                                                <li className={styles['tag-input-filter']}>
                                                    <span>{key}</span>
                                                    <UIIcon
                                                        className={(styles['delete-icon'])}
                                                        code={'\uf046'}
                                                        size="14px"
                                                        onClick={() => { this.handleDeleteTagInputKeys(key) }}
                                                    >
                                                    </UIIcon>
                                                </li>
                                            )
                                        }
                                    </ul>
                                    <TextInput
                                        className={styles['condition-tag-input']}
                                        type="text"
                                        value={tagInputValue}
                                        placeholder={tagInputKeys.length === 0 ? __('请输入标签') : ''}
                                        onChange={(value) => { this.handleTagInputChange(value) }}
                                        onKeyDown={(e) => { this.handleTagInputKeyDown(e) }}
                                        ref="tagInput"
                                    >
                                    </TextInput>
                                </div>
                                <UIIcon
                                    className={(styles['confirm-icon'])}
                                    code={'\uf068'}
                                    size="16px"
                                    disabled={tagInputKeys.length === 0}
                                    onClick={() => { this.handleConfirmAddTag() }}
                                >
                                </UIIcon>
                                <UIIcon
                                    className={(styles['cancel-icon'])}
                                    code={'\uf046'}
                                    size="16px"
                                    onClick={() => { this.handleCancelAddTag() }}
                                >
                                </UIIcon>
                            </div>
                            :
                            null
                    }

                </ul>

                {
                    <PopMenu
                        anchor={tagInputAnchor}
                        anchorOrigin={['right', 'bottom']}
                        targetOrigin={['right', 'top']}
                        className={classnames(styles['condition-taginput-menu'])}
                        open={tagSuggestions && isTagSuggestionShow}
                        onClickAway={this.handleHideTagSuggestionMenu.bind(this)}
                        watch={true}
                        freezable={true}
                    >
                        {
                            tagSuggestions ?
                                tagSuggestions.length === 0 ?
                                    <PopMenuItem
                                        iconElementLeft={React.createElement('span')}
                                        className={styles['condition-taginput-menuitem']}
                                        label={
                                            <Text
                                                ellipsizeMode={'tail'}
                                            >
                                                {__('未找到匹配的结果')}
                                            </Text>
                                        }
                                    >
                                    </PopMenuItem>
                                    :
                                    tagSuggestions.map((singleSuggestion) =>
                                        <PopMenuItem
                                            iconElementLeft={React.createElement('span')}
                                            className={styles['condition-taginput-menuitem']}
                                            label={
                                                <Text
                                                    ellipsizeMode={'tail'}
                                                >
                                                    {singleSuggestion}
                                                </Text>
                                            }
                                            onClick={() => { this.handleClickTagSuggestionMenu(singleSuggestion) }}
                                        >
                                        </PopMenuItem>
                                    )

                                :
                                null

                        }

                    </PopMenu>

                }
            </div>
        )
    }
}