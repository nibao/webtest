import { expect } from 'chai';
import * as sinon from 'sinon';
import * as redirect from '../apis/eachttp/redirect/redirect';
import * as config from '../config/config';
import { buildInvitationHref } from './invitationconfig';

describe('ShareWebCore', () => {
    describe('invitationconfig', () => {
        describe('构建共享邀请链接#buildInvitationHref', () => {
            const sandbox = sinon.createSandbox();
            beforeEach('stub', () => {
                sandbox.stub(redirect, 'getHostInfo');
                sandbox.stub(config, 'getConfig');
            });

            afterEach('restore', () => {
                sandbox.restore();
            });

            it('使用http', () => {
                config.getConfig.resolves(false);
                redirect.getHostInfo.resolves({
                    host: 'anyshare.com',
                    port: 80,
                    https_port: 443
                });
                return buildInvitationHref('72d45ee-d1e5-4159-af6e-a4283922c009').then(
                    value => {
                        expect(value).to.equal(
                            'http://anyshare.com:80/invitation/72d45ee-d1e5-4159-af6e-a4283922c009'
                        );
                    }
                );
            });

            it('使用https', () => {
                config.getConfig.resolves(true);
                redirect.getHostInfo.resolves({
                    host: 'anyshare.com',
                    port: 80,
                    https_port: 443
                });
                return buildInvitationHref('72d45ee-d1e5-4159-af6e-a4283922c009').then(
                    value => {
                        expect(value).to.equal(
                            'https://anyshare.com:443/invitation/72d45ee-d1e5-4159-af6e-a4283922c009'
                        );
                    }
                );
            });
        });
    });
});
