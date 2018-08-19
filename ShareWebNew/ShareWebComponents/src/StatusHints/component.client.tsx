import * as React from 'react';
import * as classnames from 'classnames';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import StatusHintsBase from './component.base';
import * as styles from './styles.client.css';
import __ from './locale';

const Item = ({ children, code, color }) => (
    <div className={styles['item']}>
        <UIIcon
            code={code}
            size={16}
            color={color}
        />
        <div className={styles['pad']} />
        {children}
    </div>
)

export default class StatusHints extends StatusHintsBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['head-content']}>
                    <div className={styles['big-font']}>
                        {__('欢迎登录！')}
                    </div>
                    <div className={classnames(styles['sub-item'], styles['small-font'])}>
                        {__('请在云盘目录下进行文档操作和共享。')}
                    </div>
                    {/* <div className={styles['link-wrap']}>
                        <LinkChip className={styles['link']} onClick={this.viewHelp.bind(this)}>
                            {__('查看帮助 >>')}
                        </LinkChip>
                    </div>
                    <div className={styles['link-wrap']}>
                        <LinkChip className={styles['link']} onClick={this.viewFAQ.bind(this)}>
                            {__('常见问题 >>')}
                        </LinkChip>
                    </div> */}
                </div>
                <div className={classnames(styles['state-content'], styles['small-font'])}>
                    <span className={styles['form']}>
                        <UIIcon
                            code={'\uf060'}
                            size={16}
                        />
                    </span>
                    <span className={styles['form']}>
                        {__('文档状态提示')}
                    </span>
                </div>
                <Item code={'\uf061'} color={'#2a78e4'}>
                    {__('未缓存到本地的文件/文件夹')}
                </Item>
                <Item code={'\uf062'} color={'#eb7931'}>
                    {__('正在同步的文件/文件夹')}
                </Item>
                <Item code={'\uf063'} color={'#009e11'}>
                    {__('已缓存到本地的文件/文件夹')}
                </Item>
                <Item code={'\uf064'} color={'#562075'}>
                    {__('已被锁定的文件')}
                </Item>
                <Item code={'\uf065'} color={'#757575'}>
                    {__('无法同步的文件/文件夹')}
                </Item>
            </div>
        )

    }
}