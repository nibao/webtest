import * as React from 'react';
import { Link } from 'react-router';
import * as styles from './styles.css';

export default class Index extends React.Component<any, any> {
    render() {
        return (
            <div className={ styles['container'] }>
                <div className={ styles['header'] }>
                    <div className={ styles['inner'] }>
                        <div className={ styles['title'] }>
                            Web API
                        </div>
                        <div className={ styles['menu'] }>
                            <ul>
                                <li className={ styles['main-nav-item'] }>
                                    <Link className={ styles['main-nav-link'] } activeClassName={ styles['active'] } to="intro">INTRO</Link>
                                </li>
                                <li className={ styles['main-nav-item'] }>
                                    <Link className={ styles['main-nav-link'] } activeClassName={ styles['active'] } to="ui">UI</Link>
                                </li>
                                <li className={ styles['main-nav-item'] }>
                                    <Link className={ styles['main-nav-link'] } activeClassName={ styles['active'] } to="openapi">OpenAPI</Link>
                                </li>
                                <li className={ styles['main-nav-item'] }>
                                    <Link className={ styles['main-nav-link'] } activeClassName={ styles['active'] } to="components">COMPONENTS</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={ styles['main'] }>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}