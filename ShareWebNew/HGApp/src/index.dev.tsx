import * as React from 'react'
import { render } from 'react-dom'
import Routes from './routes'
import { AppContainer } from 'react-hot-loader'
import { apply as applySkin } from '../core/skin/skin';
import '../libs/reset.css'
import '../libs/root.css'
import './root.css'

applySkin()

render(
    <AppContainer>
        <Routes />
    </AppContainer>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept('./routes', () => {
        const NextRoutes = require('./routes').default
        render(
            <AppContainer>
                <NextRoutes />
            </AppContainer>,
            document.getElementById('root')
        )
    })
}