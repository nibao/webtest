import * as React from 'react';
import { Link } from 'react-router';
import * as classnames from 'classnames';
import { shrinkText } from '../../../util/formatters/formatters';
import { SiteType } from '../../../core/thrift/sharesite/helper';
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import Expand from '../../../ui/Expand/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Title from '../../../ui/Title/ui.desktop';
import { PureComponent } from '../../../ui/decorators';
import __ from './locale';
import * as expanded from '../../assets/icon_pulldown.png';
import * as collapsed from '../../assets/icon_right.png';
import * as styles from './styles.css';

@PureComponent
export default class NavTree extends React.Component<any, any> {

    static contextTypes = Link.contextTypes

    state = {
        /**
         * 使用第三方数据库
         */
        useExternalDb: false
    }

    type = {
        [SiteType.NCT_SITE_TYPE_NORMAL]: '',
        [SiteType.NCT_SITE_TYPE_MASTER]: __('（总站点）'),
        [SiteType.NCT_SITE_TYPE_SLAVE]: __('（分站点）')
    }

    async componentWillMount() {
        // 判断是否使用第三方数据库
        try {
            this.setState({
                useExternalDb: await ECMSManagerClient.is_external_db()
            })
        } catch (ex) {
            // 视为使用本地数据库，默认不处理
        }
    }

    isActive(location) {
        const { router } = this.context
        return router && router.isActive(location, true)
    }

    /**
     * 点击react-router Link触发
     */
    handleLinkClick(event, location) {
        // 跳转路由不变时不触发
        if (this.isActive(location)) {
            event.preventDefault()
        }
    }

    /**
     * 按节点ip从小到大排序
     */
    sortNodes(nodes) {
        return nodes.sort((pre, next) => pre.node_ip.split('.').join('') - next.node_ip.split('.').join(''))
    }

    render() {
        const { sites, nodes, expand, onExpand, onExpandSite } = this.props;
        const { useExternalDb } = this.state;
        return (
            <ul>
                <li>
                    <Link
                        to={'/home/system'}
                        className={classnames(styles['node-content'], styles['level1'], styles['link'], { [styles['active']]: this.isActive('/home/system') })}
                        onlyActiveOnIndex={true}
                        draggable={false}
                        onClick={(e) => this.handleLinkClick(e, '/home/system')}
                    >
                        <UIIcon
                            size={13}
                            className={classnames(styles['item'])}
                            code={expand['home/system'] ? '\uf04c' : '\uf04e'}
                            fallback={expand['home/system'] ? expanded : collapsed}
                            onClick={e => onExpand(e, 'home/system')}
                        />
                        <UIIcon
                            code={'\uf0ac'}
                            size={16}
                            color={'#333'}
                            className={classnames(styles['item'])}
                        />
                        <span>{__('系统')}</span>
                    </Link>

                    <Expand
                        open={expand['home/system']}
                    >
                        <ul>
                            {
                                sites.map(site => {
                                    const sitePath = `home/system/${site.id}`;
                                    if (site.id === sites[0].id) { // 目前只显示当前站点
                                        return (
                                            <li key={site.id}>
                                                <Link
                                                    to={sitePath}
                                                    className={classnames(styles['link'], styles['node-content'],
                                                        styles['level2'],
                                                        { [styles['active']]: this.isActive(sitePath) })}
                                                    onlyActiveOnIndex={true}
                                                    draggable={false}
                                                    onClick={(e) => this.handleLinkClick(e, sitePath)}
                                                >
                                                    <UIIcon
                                                        size={13}
                                                        className={classnames([styles['item']], { [styles['leaf']]: site.id !== sites[0].id })}
                                                        code={expand[sitePath] ? '\uf04c' : '\uf04e'}
                                                        fallback={expand[sitePath] ? expanded : collapsed}
                                                        onClick={e => onExpandSite(e, site.id)}
                                                    />
                                                    <UIIcon
                                                        className={styles['item']}
                                                        code={'\uf0ad'}
                                                        size={16}
                                                        color={'#333'}
                                                    />
                                                    <Title
                                                        content={site.name}
                                                    >
                                                        {shrinkText(site.name, { limit: 15 })}
                                                        {
                                                            site.type ?
                                                                this.type[site.type] :
                                                                null
                                                        }
                                                    </Title>
                                                </Link>
                                                {
                                                    site.id === sites[0].id && nodes ?
                                                        <Expand
                                                            open={expand[sitePath]}
                                                        >
                                                            <ul>
                                                                <li>
                                                                    <Link
                                                                        to={`${sitePath}/server`}
                                                                        className={classnames(
                                                                            styles['node-content'],
                                                                            styles['level3'],
                                                                            styles['link'],
                                                                            { [styles['active']]: this.isActive(`${sitePath}/server`) }
                                                                        )}
                                                                        onlyActiveOnIndex={true}
                                                                        draggable={false}
                                                                        onClick={(e) => this.handleLinkClick(e, `${sitePath}/server`)}
                                                                    >
                                                                        <UIIcon
                                                                            size={13}
                                                                            className={classnames([styles['item']])}
                                                                            code={expand[`${sitePath}/server`] ? '\uf04c' : '\uf04e'}
                                                                            fallback={expand[`${sitePath}/server`] ? expanded : collapsed}
                                                                            onClick={e => onExpand(e, `${sitePath}/server`)}
                                                                        />
                                                                        <UIIcon
                                                                            className={styles['item']}
                                                                            code={'\uf0ae'}
                                                                            size={16}
                                                                            color={'#333'}
                                                                        />
                                                                        <span>{__('服务器管理')}</span>
                                                                    </Link>
                                                                    <Expand
                                                                        open={expand[`${sitePath}/server`]}
                                                                    >
                                                                        <ul>
                                                                            {
                                                                                this.sortNodes(nodes).map(node => {
                                                                                    const nodePath = `${sitePath}/server/${node.node_ip}`
                                                                                    return (
                                                                                        <li key={node.node_ip}>
                                                                                            <Link
                                                                                                to={nodePath}
                                                                                                className={classnames(
                                                                                                    styles['node-content'],
                                                                                                    styles['level4'],
                                                                                                    styles['link'],
                                                                                                    { [styles['active']]: this.isActive(nodePath) }
                                                                                                )}
                                                                                                onlyActiveOnIndex={true}
                                                                                                draggable={false}
                                                                                                onClick={(e) => this.handleLinkClick(e, nodePath)}
                                                                                            >
                                                                                                <UIIcon
                                                                                                    size={13}
                                                                                                    className={classnames(styles['item'], styles['leaf'])}
                                                                                                    code={expand[nodePath] ? '\uf04c' : '\uf04e'}
                                                                                                    fallback={expand[nodePath] ? expanded : collapsed}
                                                                                                    onClick={e => onExpand(e, nodePath)}
                                                                                                />
                                                                                                <UIIcon
                                                                                                    className={styles['item']}
                                                                                                    code={'\uf0af'}
                                                                                                    size={16}
                                                                                                    color={'#333'}
                                                                                                />
                                                                                                <span>
                                                                                                    {node.node_ip}
                                                                                                </span>
                                                                                            </Link>
                                                                                        </li>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </Expand>
                                                                </li>
                                                                {
                                                                    useExternalDb ? // 使用第三方数据库时显示数据库子系统导航
                                                                        <li>
                                                                            <Link
                                                                                to={`${sitePath}/database`}
                                                                                className={classnames(
                                                                                    styles['node-content'],
                                                                                    styles['level3'],
                                                                                    styles['link'],
                                                                                    { [styles['active']]: this.isActive(`${sitePath}/database`) }
                                                                                )}
                                                                                onlyActiveOnIndex={true}
                                                                                draggable={false}
                                                                                onClick={(e) => this.handleLinkClick(e, `${sitePath}/database`)}
                                                                            >
                                                                                <UIIcon
                                                                                    size={13}
                                                                                    className={classnames([styles['item']], [styles['leaf']])}
                                                                                    code={expand[`${sitePath}/database`] ? '\uf04c' : '\uf04e'}
                                                                                    fallback={expand[`${sitePath}/database`] ? expanded : collapsed}
                                                                                    onClick={e => onExpand(e, `${sitePath}/database`)}
                                                                                />
                                                                                <UIIcon
                                                                                    className={styles['item']}
                                                                                    code={'\uf0b1'}
                                                                                    size={16}
                                                                                    color={'#333'}
                                                                                />
                                                                                <span>{__('数据库子系统')}</span>
                                                                            </Link>
                                                                        </li>
                                                                        : null
                                                                }
                                                                {/* { // 暂时屏蔽应用子系统
                                                                    <li>
                                                                        <Link
                                                                            to={`${sitePath}/application`}
                                                                            className={classnames(
                                                                                styles['node-content'],
                                                                                styles['level3'],
                                                                                styles['link'],
                                                                                { [styles['active']]: this.isActive(`${sitePath}/application`) }
                                                                            )}
                                                                            onlyActiveOnIndex={true}
                                                                            draggable={false}
                                                                            onClick={(e) => this.handleLinkClick(e, `${sitePath}/application`)}
                                                                        >
                                                                            <UIIcon
                                                                                size={13}
                                                                                className={classnames([styles['item']], [styles['leaf']])}
                                                                                code={expand[`${sitePath}/application`] ? '\uf04c' : '\uf04e'}
                                                                                fallback={expand[`${sitePath}/application`] ? expanded : collapsed}
                                                                                onClick={e => onExpand(e, `${sitePath}/application`)}
                                                                            />
                                                                            <UIIcon
                                                                                className={styles['item']}
                                                                                code={'\uf0b2'}
                                                                                size={16}
                                                                                color={'#333'}
                                                                            />
                                                                            <span>{__('应用子系统')}</span>
                                                                        </Link>
                                                                    </li>
                                                                } */}
                                                                {
                                                                    <li>
                                                                        <Link
                                                                            to={`${sitePath}/storage`}
                                                                            className={classnames(
                                                                                styles['node-content'],
                                                                                styles['level3'],
                                                                                styles['link'],
                                                                                { [styles['active']]: this.isActive(`${sitePath}/storage`) }
                                                                            )}
                                                                            onlyActiveOnIndex={true}
                                                                            draggable={false}
                                                                            onClick={(e) => this.handleLinkClick(e, `${sitePath}/storage`)}
                                                                        >
                                                                            <UIIcon
                                                                                size={13}
                                                                                className={classnames([styles['item']], [styles['leaf']])}
                                                                                code={expand[`${sitePath}/storage`] ? '\uf04c' : '\uf04e'}
                                                                                fallback={expand[`${sitePath}/storage`] ? expanded : collapsed}
                                                                                onClick={e => onExpand(e, `${sitePath}/storage`)}
                                                                            />
                                                                            <UIIcon
                                                                                className={styles['item']}
                                                                                code={'\uf0b3'}
                                                                                size={16}
                                                                                color={'#333'}
                                                                            />
                                                                            <span>{__('存储子系统')}</span>
                                                                        </Link>
                                                                    </li>
                                                                }
                                                                <li>
                                                                    <Link
                                                                        to={`${sitePath}/siteconfig`}
                                                                        className={classnames(
                                                                            styles['node-content'],
                                                                            styles['level3'],
                                                                            styles['link'],
                                                                            { [styles['active']]: this.isActive(`${sitePath}/siteconfig`) }
                                                                        )}
                                                                        onlyActiveOnIndex={true}
                                                                        draggable={false}
                                                                        onClick={(e) => this.handleLinkClick(e, `${sitePath}/siteconfig`)}
                                                                    >
                                                                        <UIIcon
                                                                            size={13}
                                                                            className={classnames([styles['item']], [styles['leaf']])}
                                                                            code={expand[`${sitePath}/siteconfig`] ? '\uf04c' : '\uf04e'}
                                                                            fallback={expand[`${sitePath}/siteconfig`] ? expanded : collapsed}
                                                                            onClick={e => onExpand(e, `${sitePath}/siteconfig`)}
                                                                        />
                                                                        <UIIcon
                                                                            className={styles['item']}
                                                                            code={'\uf044'}
                                                                            size={16}
                                                                            color={'#333'}
                                                                        />
                                                                        <span>{__('站点配置')}</span>
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link
                                                                        to={`${sitePath}/siteupdate`}
                                                                        className={classnames(
                                                                            styles['node-content'],
                                                                            styles['level3'],
                                                                            styles['link'],
                                                                            { [styles['active']]: this.isActive(`${sitePath}/siteupdate`) }
                                                                        )}
                                                                        onlyActiveOnIndex={true}
                                                                        draggable={false}
                                                                        onClick={(e) => this.handleLinkClick(e, `${sitePath}/siteupdate`)}
                                                                    >
                                                                        <UIIcon
                                                                            size={13}
                                                                            className={classnames([styles['item']], [styles['leaf']])}
                                                                            code={expand[`${sitePath}/siteupdate`] ? '\uf04c' : '\uf04e'}
                                                                            fallback={expand[`${sitePath}/siteupdate`] ? expanded : collapsed}
                                                                            onClick={e => onExpand(e, `${sitePath}/siteupdate`)}
                                                                        />
                                                                        <UIIcon
                                                                            className={styles['item']}
                                                                            code={'\uf0b4'}
                                                                            size={16}
                                                                            color={'#333'}
                                                                        />
                                                                        <span>{__('站点升级')}</span>
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </Expand>
                                                        : null
                                                }
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </Expand>
                </li>
            </ul>
        )
    }
}