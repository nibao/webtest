import * as React from 'react'
import { render } from 'react-dom'
import Routes from './routes'
import { setup as setupOpenAPI } from '../core/openapi/openapi'
import { apply as applySkin } from '../core/skin/skin';
import '../libs/reset.css'
import '../libs/root.css'
import './root.css'

function boot() {

    try {
        setupOpenAPI({
            host: HGAppConfig.host
        })
    } catch (e) {
        alert(e.stack)
    }

    applySkin()

    render(<Routes />, document.getElementById('root'))

}

document.addEventListener("deviceready", boot, false);