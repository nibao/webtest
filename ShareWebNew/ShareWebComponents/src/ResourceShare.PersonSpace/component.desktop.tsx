import * as React from 'react';
import SharePersonSpaceBase from './component.base';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import * as classnames from 'classnames'
import * as styles from './styles.desktop.css';


export default class SharePersonSpace extends SharePersonSpaceBase {
    Teacher = ({ roleName_zh_cn, activeIndex }) => {
        return (
            <div>
                <p className={styles['role-msg']}>你的身份为<span className={styles['rolename']}>{roleName_zh_cn}</span>，请选择要分享到的文件夹</p>
                <ul className={styles['list']}>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '1' ? true : false })} key="1" onClick={() => this.handleClick('1', '教学设计')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '1' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学设计</p>
                    </li>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '2' ? true : false })} key="2" onClick={() => this.handleClick('2', '教学课件')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '2' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学课件</p>
                    </li>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '3' ? true : false })} key="3" onClick={() => this.handleClick('3', '教学视频')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '3' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学视频</p>
                    </li>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '4' ? true : false })} key="4" onClick={() => this.handleClick('4', '媒体素材')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '4' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>媒体素材</p>
                    </li>
                </ul>
            </div>
        )
    }
    Instructor = ({ roleName_zh_cn, activeIndex }) => {
        return (
            <div>
                <p className={styles['role-msg']}>你的身份为<span className={styles['rolename']}>{roleName_zh_cn}</span>，请选择要分享到的文件夹</p>
                <ul className={styles['list']}>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '11' ? true : false })} key="11" onClick={() => this.handleClick('11', '教学设计')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '11' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学设计</p>
                    </li>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '12' ? true : false })} key="12" onClick={() => this.handleClick('12', '教学论文')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '12' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学论文</p>
                    </li>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '13' ? true : false })} key="13" onClick={() => this.handleClick('13', '教学课件')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '13' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学课件</p>
                    </li>
                    <li className={classnames(styles['item'], { [styles['selected']]: activeIndex === '14' ? true : false })} key="14" onClick={() => this.handleClick('14', '教学资料')}>
                        <UIIcon code={'\uf079'}
                            size={70}
                            color={activeIndex === '14' ? '#7a8fa9' : '#bfbfbf'}
                            className={styles['item-icon']}
                        />
                        <p className={styles['item-text']}>教学资料</p>
                    </li>
                </ul>
            </div>
        )
    }
    render() {
        const Teacher = this.Teacher;
        const Instructor = this.Instructor;
        const { unknownRole, roleName, roleName_zh_cn, activeIndex } = this.state;
        return (
            <div className={styles['container']}>
                {roleName === 'teacher' ? <Teacher roleName_zh_cn={roleName_zh_cn} activeIndex={activeIndex} /> : null}
                {roleName === 'instructor' ? < Instructor roleName_zh_cn={roleName_zh_cn} activeIndex={activeIndex} /> : null}
                {unknownRole ? <p className={styles['role-msg']}>您的当前身份不是 教师 或 教研员，无法将文件分享到个人空间。</p> : null}
            </div>
        )
    }
}