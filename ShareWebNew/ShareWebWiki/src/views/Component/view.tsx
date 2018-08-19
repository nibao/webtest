import * as React from 'react';
import { Link } from 'react-router';
import { merge, trimRight } from 'lodash';
import { get } from '../../../util/http/http';
import DataGrid from '../../../ui/DataGrid/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import CheckBox from '../../../ui/CheckBox/ui.desktop';
import { typeFormatter } from '../helper';
import list from './list';
import * as styles from './styles.css';

export default class ComponentView extends React.Component<any, any> {
    private componentWillMount() {
        this.setState({ props: this.props.api.reduce((result, prop) => Object.assign(result, { [prop.name]: prop.defaultValue }), {}) })
    }

    state = {
        props: {

        }
    }

    render() {
        return (
            <div className={ styles['container'] }>
                <div className={ styles['nav'] }>
                    <ul>
                        {
                            list.map(view => (
                                <li className={ styles['nav-item'] }>
                                    <Link
                                        to={ `/components/${trimRight(view.name, 'View')}` }
                                        className={ styles['nav-link'] }
                                        activeClassName={ styles['active'] }
                                    >
                                        {
                                            trimRight(view.name, 'View')
                                        }
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className={ styles['content'] }>
                    <header className={ styles['header'] }>
                        <h1 className={ styles['title'] }>
                            {
                                this.props.name
                            }
                        </h1>
                        <cite className={ styles['subtitle'] }>
                            {
                                this.props.description
                            }
                        </cite>
                    </header>
                    <div className={ styles['api'] }>
                        <DataGrid
                            height={ 200 }
                            data={ this.props.api }>
                            <DataGrid.Field
                                label="参数名"
                                field="name"
                            />
                            <DataGrid.Field
                                field="type"
                                label="类型"
                                formatter={ typeFormatter }
                            />
                            <DataGrid.Field
                                label="必须"
                                field="required"
                                formatter={ required => required ? 'Y' : 'N' }
                            />
                            <DataGrid.Field
                                label="默认值"
                                field="defaultValue"
                                formatter={ defaultValue => defaultValue.toString() }
                            />
                            <DataGrid.Field
                                label="备注"
                                field="note"
                            />
                            <DataGrid.Field
                                label="值"
                                field="name"
                                formatter={ (prop, { type }) => {
                                    switch (true) {
                                        case type === String:
                                            return (
                                                <TextBox value={ this.state.props[prop] } onChange={ value => this.setState({ props: Object.assign(this.state.props, { [prop]: value }) }) } />
                                            )

                                        case type === Boolean:
                                            return (
                                                <CheckBox checked={ this.state.props[prop] } onChange={ value => this.setState({ props: Object.assign(this.state.props, { [prop]: value }) }) } />
                                            )
                                    }
                                } }
                            />
                        </DataGrid>
                    </div>
                    <div className={ styles['spliter'] } ></div>
                    <div className={ styles['demo'] } >
                        <h2>
                            查看效果：
                        </h2>
                        <div className={ styles['demostration'] }>
                            {
                                React.Children.map(this.props.children, child => React.cloneElement(child, this.state.props))
                            }
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}