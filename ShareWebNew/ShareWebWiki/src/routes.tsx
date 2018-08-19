import * as React from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import session from '../util/session/session';
import { getOpenAPIConfig } from '../core/openapi/openapi';
import Index from './views/index/view';
import Intro from './views/Intro/view';
import OpenAPI from './views/OpenAPI/view';
import Config from './views/Config/view';
import UIList from './views/UI/list';
import ComponentList from './views/Component/list';

/**
 * 动态获取UI视图
 */
function getUIView({ params }, callback) {
    return callback(null, UIList.find(view => view.name === `${params.name}View`))
}

/**
 * 动态获取Component视图
 */
function getComponentView({ params }, callback) {
    return callback(null, ComponentList.find(view => view.name === `${params.name}View`))
}

/**
 * 检查是否配置过AnyShare
 */
function checkConfig(state, replace) {
    if (!session.get('userid') || !session.get('tokenid') || !getOpenAPIConfig('host')) {
        replace({ pathname: '/config' });
    }
}

export default class Routes extends React.Component<any, any> {
    render() {
        return (
            <Router history={ hashHistory }>
                <Route path="/" component={ Index }>
                    <IndexRedirect to="intro" />
                    <Route path="intro" component={ Intro } />
                    <Route path="ui">
                        <IndexRedirect to="DataGrid" />
                        <Route path=":name" getComponent={ getUIView } />
                    </Route>
                    <Route path="openapi" component={ OpenAPI } />
                    <Route path="config" component={ Config } />
                    <Route path="components" onEnter={ checkConfig }>
                        <IndexRedirect to="Login" />
                        <Route path=":name" getComponent={ getComponentView } />
                    </Route>
                </Route>
            </Router>
        )
    }
}