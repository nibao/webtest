import * as React from 'react';
import { Link } from 'react-router';
import { merge, trimRight } from 'lodash';
import DataGrid from '../../../ui/DataGrid/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import TextArea from '../../../ui/TextArea/ui.desktop';
import CheckBox from '../../../ui/CheckBox/ui.desktop';
import Select from '../../../ui/Select/ui.desktop';
import { typeFormatter } from '../helper';
import list from './list';
import * as styles from './styles.css';

export default class UIView extends React.Component<any, any> {
    private componentWillMount() {
        this.setState({ props: this.props.api.reduce((result, prop) => merge(result, { [prop.name]: prop.defaultValue }), {}) })
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
                                        to={ `/ui/${trimRight(view.name, 'View')}` }
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
                            data={ this.props.api }
                            strap={ true }
                        >
                            <DataGrid.Field
                                label="参数名"
                                field="name"
                                width={ 50 }
                            />
                            <DataGrid.Field
                                field="type"
                                label="类型"
                                width={ 75 }
                                formatter={ typeFormatter }
                            />
                            <DataGrid.Field
                                label="必须"
                                field="required"
                                width={ 25 }
                                formatter={ required => required ? 'Y' : 'N' }
                            />
                            <DataGrid.Field
                                label="默认值"
                                field="defaultValue"
                                formatter={ defaultValue => defaultValue !== undefined && String(defaultValue) }
                            />
                            <DataGrid.Field
                                label="备注"
                                field="note"
                            />
                            <DataGrid.Field
                                label="试试看"
                                field="name"
                                width={ 75 }
                                formatter={ (prop, { type, defaultValue }) => {
                                    switch (true) {
                                        case type === String:
                                            return (
                                                <TextBox
                                                    value={ this.state.props[prop] }
                                                    onChange={ value => this.setState({ props: Object.assign(this.state.props, { [prop]: value }) }) }
                                                />
                                            )

                                        case type === Number:
                                            return (
                                                <TextBox
                                                    value={ this.state.props[prop] }
                                                    validator={ value => parseInt(value) === value }
                                                    onChange={ value => this.setState({ props: Object.assign(this.state.props, { [prop]: value }) }) }
                                                />
                                            )

                                        case type === Boolean:
                                            return (
                                                <CheckBox
                                                    checked={ this.state.props[prop] }
                                                    onChange={ value => this.setState({ props: Object.assign(this.state.props, { [prop]: value }) }) }
                                                />
                                            )

                                        case Array.isArray(type):
                                            return (
                                                <Select
                                                    value={ this.state.props[prop] }
                                                    onChange={ value => this.setState({ props: Object.assign(this.state.props, { [prop]: value }) }) }>
                                                    {
                                                        type.map(t => (
                                                            <Select.Option value={ t }>{ t }</Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            )

                                        default:
                                            return '暂不支持'
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