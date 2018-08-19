import * as React from 'react';
import ComponentView from '../../Component/view';
import Login from '../../../../components/Login/component.desktop';

export default function LoginView() {
    return (
        <ComponentView
            name={ '<Login />' }
            description={ '登录组件' }
            api={
                [
                ]
            }>
            <Login />
        </ComponentView>
    )
}