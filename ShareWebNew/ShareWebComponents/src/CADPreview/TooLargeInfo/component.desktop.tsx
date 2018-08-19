import * as React from 'react'
import FlexBox from '../../../ui/FlexBox/ui.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import * as styles from './styles.desktop'
import __ from './locale'

const TooLargeInfo: React.StatelessComponent<any> = () => {
    return (
        <div className={styles['container']}>
            <FlexBox>
                <FlexBox.Item align="middle center">
                    <div className={styles['warning-icon']}>
                        <UIIcon
                            size={'64px'}
                            code={'\uf030'}
                            color="#757575"
                        />
                    </div>
                    <div className={styles['message']}>
                        {__('加载失败，文件大小已超过该文件类型的预览限制（80MB）。')}
                    </div>
                </FlexBox.Item>
            </FlexBox>
        </div>
    )
}

export default TooLargeInfo