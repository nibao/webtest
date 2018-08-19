import * as React from 'react';
import { Browser, userAgent } from '../../util/browser/browser';
import WeChatTip from '../WeChatTip/component.mobile';
import MobileClientBase from './component.base';

export default class MobileClient extends MobileClientBase {
    render() {
        return (
            userAgent().app === Browser.WeChat ? (
                <WeChatTip />
            ) : <div></div>
        )
    }
}

