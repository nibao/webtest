import * as React from 'react'

export default {
    '/': require('./Root/view').default,
    '/index': require('./Index/view').default,
    '/home': require('./Home/view').default,
    '/home/documents': require('./Docs/view').default,
    '/home/user': require('./User/view').default,
    '/sso': require('./SSO/view').default,
    '/invitation': require('./Invitation/view').default,
    '/mobileclient': require('./MobileClient/view').default,
    '/link': require('./Link/view').default
}