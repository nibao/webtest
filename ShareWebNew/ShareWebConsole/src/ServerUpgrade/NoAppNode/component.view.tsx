import * as React from 'react'
import { noop } from 'lodash'
import { FlexBox, UIIcon, LinkChip } from '../../../ui/ui.desktop'
import * as styles from './styles.view'
import __ from './locale'

const NoAppNode: React.StatelessComponent<Console.ServerUpgrade.NoAppNode.Props> = ({
    doRedirectServers = noop
}) => {
    return (
        <div className={styles['container']}>
            <FlexBox>
                <FlexBox.Item align="middle center">
                    <div className={styles['warning-icon']}>
                        <UIIcon
                            size={'64px'}
                            code={'\uf021'}
                            color="#bdbdbd"
                        />
                    </div>
                    <div className={styles['text-area']}>
                        {__('未设置应用节点，前往')}
                        <LinkChip
                            className={styles['text-link']}
                            onClick={doRedirectServers}
                        >
                            {__('服务器管理')}
                        </LinkChip>
                        <span className={styles['or-text']}>
                            {__('进行设置。')}
                        </span>
                    </div>
                </FlexBox.Item>
            </FlexBox>
        </div>
    )
}

export default NoAppNode