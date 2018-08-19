import * as React from 'react';
import ShareClassSpaceBase from './component.base';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import * as classnames from 'classnames'
import * as styles from './styles.desktop.css';


export default class ShareClassSpace extends ShareClassSpaceBase {
    render() {
        const { classList, noClass } = this.state;
        return (
            <div className={styles['container']}>
                {
                    noClass ?
                        <p className={styles['class-msg']}>您的当前身份下无班级信息，无法将文件分享到班级空间。</p>
                        :
                        <ul className={styles['list']}>
                            {
                                this.state.classList.map((item) => (
                                    <li className={classnames(styles['item'], { [styles['selected']]: this.state.activeIndex === item['id'] ? true : false })}
                                        onClick={() => this.handleClick(item['id'], item['name'])}>
                                        <UIIcon code={'\uf079'}
                                            size={70}
                                            color={this.state.activeIndex === item['id'] ? '#7a8fa9' : '#bfbfbf'}
                                            className={styles['item-icon']}
                                        />
                                        <p className={styles['item-text']}>{item['name']}</p>
                                    </li>
                                ))
                            }
                        </ul>
                }
            </div>
        )
    }
}