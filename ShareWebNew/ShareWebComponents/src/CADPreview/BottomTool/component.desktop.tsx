import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import * as styles from './styles.desktop'

const BottomTool: React.StatelessComponent<Components.CADPreview.BottomTool.Props> = ({
    icons,
    theme = 'dark',
    onMouseMoveBottomTool = noop
}) => {
    // 计算工具栏宽度
    const width = icons.length * 40 + 10;

    return (
        <div
            className={classnames(styles['container'], (theme === 'dark') ? styles['black-background'] : styles['white-background'])}
            style={{ width }}
            onMouseMove={onMouseMoveBottomTool}
        >
            {
                icons.map(({ code, title, onClick }) => (
                    <UIIcon
                        className={styles['icon']}
                        titleClassName={styles['title-style']}
                        code={code}
                        title={title}
                        onClick={onClick}
                        size={16}
                    />
                ))
            }
        </div>
    )
}

export default BottomTool