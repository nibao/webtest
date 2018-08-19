import * as React from 'react'
import RouteTabs from '../../../components/RouteTabs/component.mobile'
import UIIcon from '../../../ui/UIIcon/ui.mobile'
import * as styles from '../styles.css'

const IconMap = {
    'home.documents': <UIIcon code={'\uf081'} size={'0.75rem'} />,
    'home.user': <UIIcon code={'\uf01f'} size={'0.75rem'} />
}

const HomeTabs = ({ nav }) => (
    <RouteTabs className={styles['nav-tabs']}>
        {
            nav.map(({ path, label }) => (
                <RouteTabs.Tab
                    className={styles['tab']}
                    dragable={false}
                    path={path}
                    label={label}
                    icon={IconMap[path.split('/').filter(chain => chain).join('.')]}
                />
            ))
        }
    </RouteTabs>
)

export default HomeTabs