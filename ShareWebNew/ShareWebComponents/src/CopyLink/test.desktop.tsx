import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CopyLink from './component.desktop';
import fakeServer from './mockup';

declare const { describe, it, before, after };

describe('ShareWebComponents', () => {
    before(fakeServer.start);
    after(fakeServer.stop);

    describe('<CopyLink />', () => {
        describe('component.desktop.tsx', () => {

            it('使用外链，开启访问密码，开启有效期', (done) => {
                const wrapper = shallow(
                    <CopyLink
                        link="065617D1AE25C1B93874E068581113F3"
                        password="EaCK"
                        endtime={1504454399000000}
                    />
                );

                setTimeout(() => {
                    expect(wrapper.find('TextBox').prop('value')).equals('https://anyshare.eisoo.com:443/link/065617D1AE25C1B93874E068581113F3');
                    expect(wrapper.find('ClipboardButton').prop('text')).equals('https://anyshare.eisoo.com:443/link/065617D1AE25C1B93874E068581113F3\nExpiration Date: 2017-09-03\nPassword: EaCK');
                    done();
                }, 10);
            });

            it('使用外链，不开启访问密码，不开启有效期', (done) => {
                const wrapper = shallow(
                    <CopyLink
                        link="065617D1AE25C1B93874E068581113F3"
                    />
                );

                setTimeout(() => {
                    expect(wrapper.find('TextBox').prop('value')).equals('https://anyshare.eisoo.com:443/link/065617D1AE25C1B93874E068581113F3');
                    expect(wrapper.find('ClipboardButton').prop('text')).equals('https://anyshare.eisoo.com:443/link/065617D1AE25C1B93874E068581113F3');
                    done();
                }, 10);
            });


            it('使用提取码，开启访问密码，开启有效期', (done) => {
                const wrapper = shallow(
                    <CopyLink
                        enableLinkAccessCode={true}
                        accesscode="A1Ed"
                        password="EaCK"
                        endtime={1504454399000000}
                    />
                );

                setTimeout(() => {
                    expect(wrapper.find('TextBox').prop('value')).equals('A1Ed');
                    expect(wrapper.find('ClipboardButton').prop('text')).equals('A1Ed\nExpiration Date: 2017-09-03\nPassword: EaCK');
                    done();
                }, 10);
            });

            it('使用提取码，不开启访问密码，不开启有效期', (done) => {
                const wrapper = shallow(
                    <CopyLink
                        enableLinkAccessCode={true}
                        accesscode="A1Ed"
                    />
                );

                setTimeout(() => {
                    expect(wrapper.find('TextBox').prop('value')).equals('A1Ed');
                    expect(wrapper.find('ClipboardButton').prop('text')).equals('A1Ed');
                    done();
                }, 10);
            });
        })
    })
})
