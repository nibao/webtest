import * as React from 'react';
import * as classnames from 'classnames';
import Chip from '../../ui/Chip/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Locator from '../../ui/Locator/ui.desktop';
import TagAdderConfigBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale'

export default class TagAdderConfig extends TagAdderConfigBase {
    render() {
        const { results, inputValue, tags, width, labelValue } = this.state;
        return (
            <div className={styles['container']} style={{ height: this.props.height, width: this.props.width }} onClick={() => this.refs.input.focus()}>
                {
                    tags.map((o) => {
                        return (
                            <div className={styles['chip-wrap']}>
                                <Chip disabled={this.props.disabled} removeHandler={() => { this.removeTag(o) } }>
                                    {o}
                                </Chip>
                            </div>
                        )
                    })
                }
                <div className={styles['chip-wrap']} onBlur={this.blurHandler.bind(this)}>
                    <label ref="label" className={styles['label-size']}>{labelValue}</label>
                    <input
                        ref="input"
                        className={styles['input']}
                        onChange={this.changeHandler.bind(this)}
                        onClick={this.clickHandler.bind(this)}
                        value={inputValue}
                        onKeyDown={this.keyDownHandler.bind(this)}
                        style={{ width: width }}
                        />
                    {
                        results && results.length
                            ? <Locator className={styles['locator']}>
                                <ul className={classnames(styles['results'], styles['pointer'])}>
                                    {
                                        results.map((result) =>
                                            (
                                                <li className={styles['item']} onMouseDown={this.select.bind(this, result)}>
                                                    <Text>{result}</Text>
                                                </li>
                                            )
                                        )
                                    }
                                </ul>
                            </Locator>
                            : null
                    }
                </div>
            </div>
        )
    }
}