import * as React from 'react';
import session from '../../util/session/session'
import WebComponent from '../webcomponent';

export default class LinkShareRetainBase extends WebComponent<Console.LinkShareRetain.Props, any> {

    static defaultProps = {
        prefix: ''
    }

    state: Console.LinkShareRetain.State = {
        vCodeVerified: session.get('linkShareVCodeVerified') || false
    }
} 