import { expect } from 'chai';
import * as sinon from 'sinon';
import { generateGNS, sandboxStub } from '../../libs/test-helper';

import * as user from '../user/user';
import * as openapi from '../openapi/openapi';
import * as redirect from '../apis/eachttp/redirect/redirect';
import * as message from '../apis/eachttp/message/message';
import * as oem from '../oem/oem';
import * as config from '../config/config';

import {
    PERMISSIONS,
    buildLinkHref,
    buildQRCodeHref,
    writeMail
} from './linkconfig';
import * as linkconfig from './linkconfig';
import __ from './locale';

describe('ShareWebCore', () => {
    describe('linconfig', () => {
        const fakeLinkCode = generateGNS();
        const sandbox = sinon.createSandbox();
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: user,
                    moduleProp: 'get'
                },
                {
                    moduleObj: openapi,
                    moduleProp: 'getOpenAPIConfig'
                },
                {
                    moduleObj: redirect,
                    moduleProp: 'getHostInfo'
                },
                {
                    moduleObj: message,
                    moduleProp: 'sendMail'
                },
                {
                    moduleObj: oem,
                    moduleProp: 'getOEMConfByOptions'
                },
                {
                    moduleObj: config,
                    moduleProp: 'getConfig'
                }
            ]);
        });

        afterEach('restore', () => {
            sandbox.restore();
        });
        it('正确导出原子权限', () => {
            PERMISSIONS.map(permissins => {
                switch (permissins.name) {
                    case __('预览'):
                        expect(permissins.value).to.equal(1);
                        expect(permissins.require).to.deep.equal([]);
                        break;
                    case __('下载'):
                        expect(permissins.value).to.equal(2);
                        expect(permissins.require).to.deep.equal([1]);
                        break;
                    case __('上传'):
                        expect(permissins.value).to.equal(4);
                        expect(permissins.require).to.deep.equal([]);
                    default:
                        break;
                }
            });
        });

        it('计算最终权限#getFinalPerm');

        describe('构造外链地址#buildLinkHref', () => {
            it('使用https', () => {
                config.getConfig.resolves(true);
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    https_port: 443,
                    port: 80
                });
                return buildLinkHref(fakeLinkCode).then(url => {
                    expect(url).to.equal(
                        `https://anyshare.eisoo.com:443/link/${fakeLinkCode}`
                    );
                });
            });

            it('使用http', () => {
                config.getConfig.resolves(false);
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    https_port: 443,
                    port: 80
                });
                return buildLinkHref(fakeLinkCode).then(url => {
                    expect(url).to.equal(
                        `http://anyshare.eisoo.com:80/link/${fakeLinkCode}`
                    );
                });
            });
        });

        describe('构造二维码下载链接#buildQRCodeHref', () => {
            it('使用https', () => {
                config.getConfig.resolves(true);
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    https_port: 443,
                    port: 80
                });
                return buildQRCodeHref(
                    `https://anyshare.eisoo.com:443/link/${fakeLinkCode}`,
                    '0',
                    fakeLinkCode
                ).then(url => {
                    expect(url).to.equal(
                        `https://anyshare.eisoo.com:443/api/qrcode?format=0&text=https://anyshare.eisoo.com:443/link/${fakeLinkCode}&name=${fakeLinkCode}`
                    );
                });
            });

            it('使用http', () => {
                config.getConfig.resolves(false);
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    https_port: 443,
                    port: 80
                });
                return buildQRCodeHref(
                    `http://anyshare.eisoo.com:80/link/${fakeLinkCode}`,
                    '0',
                    fakeLinkCode
                ).then(url => {
                    expect(url).to.equal(
                        `http://anyshare.eisoo.com:80/api/qrcode?format=0&text=http://anyshare.eisoo.com:80/link/${fakeLinkCode}&name=${fakeLinkCode}`
                    );
                });
            });
        });

        /* 颗粒度过大，调用内部的buildLinkHref函数，无法stub */
        it('构造邮件#writeMail')

        it('发送邮件#mail')
    });
});
