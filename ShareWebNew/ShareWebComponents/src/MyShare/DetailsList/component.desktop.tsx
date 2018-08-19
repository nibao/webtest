import * as React from 'react'
import * as classnames from 'classnames';
import { DataGrid } from '@anyshare/sweet-ui';
import { buildSelectionText, SharePermissionOptions } from '../../../core/permission/permission'
import { formatTime } from '../../../util/formatters/formatters'
import { EmptyResult, Centered, Icon, Text } from '../../../ui/ui.desktop'
import * as NoSearch from '../assets/NoSearch.png'
import * as loadImg from '../assets/loading.gif'
import * as styles from './styles.desktop.css'
import __ from './locale'

/**
 * 结果为空是显示
 */
const EmptyComponent = () => (
    <EmptyResult
        picture={NoSearch}
        details={__('抱歉，没有找到符合条件的结果')}
        size={48}
        fontSize={13}
    />
)

/**
 * 加载数据时显示
 */
const RefreshingComponent = () => (
    <Centered>
        <Icon
            url={loadImg}
            size={24}
        />
        <p
            className={styles['loading-text']}
        >
            {__('正在加载，请稍候......')}
        </p>
    </Centered>
)

const DetailsList: React.StatelessComponent<Components.MyShare.DetailsList.Props> = ({
    details = [],
}) => (
        <div
            className={styles['wrapper']}
        >
            <DataGrid
                data={details}
                enableSelect={false}
                enableMultiSelect={false}
                headless={true}
                EmptyComponent={EmptyComponent}
                refreshing={!details}
                RefreshingComponent={RefreshingComponent}
                rowHoverClassName={styles['hover-action']}
                columns={[
                    {
                        title: __('共享时间：'),
                        key: 'modifytime',
                        width: '20%',
                        renderCell: (modifytime, record) =>
                            (
                                <div
                                    className={classnames(styles['item-wrapper'], styles['modifytime'])}
                                >
                                    <Text>
                                        {`${__('共享时间：')} ${formatTime(modifytime / 1000)}`}
                                    </Text>
                                </div>
                            )
                    },
                    {
                        title: __('访问者：'),
                        key: 'accessorname',
                        width: '12%',
                        renderCell: (accessorname, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {`${__('访问者：')} ${accessorname.lastIndexOf('/') !== -1 ? accessorname.substr(accessorname.lastIndexOf('/') + 1) : accessorname}`}
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('继承自：'),
                        key: 'namepath',
                        width: '23%',
                        renderCell: (namepath, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {`${__('继承自：')} ${namepath}`}
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('访问权限：'),
                        key: 'allow',
                        width: '25%',
                        renderCell: (allow, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {`${__('访问权限：')} ${buildSelectionText(SharePermissionOptions, { allow: allow, deny: record.deny, isowner: record.isowner })}`}
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('有效期至：'),
                        key: 'endtime',
                        width: '20%',
                        renderCell: (endtime, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {`${__('有效期至：')} ${endtime === -1 ? __('永久有效') : formatTime(endtime / 1000)}`}
                                </Text>
                            </div>
                        )
                    },
                ]}
            />
        </div>
    )
export default DetailsList

