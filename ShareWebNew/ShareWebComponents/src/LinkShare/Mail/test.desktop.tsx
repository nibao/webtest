import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Button from '../../../ui/Button/ui.desktop';
import ComboArea from '../../../ui/ComboArea/ui.desktop';
import Mail from './component.desktop';
import fakeServer from './mockup';

declare const { describe, it, before, after };

describe('ShareWebComponents', () => {
    before(fakeServer.start);
    after(fakeServer.stop);

    describe('<LinkShare />', () => {
        describe('<Mail />', () => {
            describe('component.desktop.tsx', () => {
                const doc = {
                    attr: 83907924,
                    client_mtime: 1501178680829576,
                    csflevel: 5,
                    docid: 'gns://618EEDE68AC5434CA1B853AC0ABFD7B5/42E4ACB5591B4C27BDBA1763455BE464',
                    modified: 1501178680829576,
                    name: 'AnyShare中文.png',
                    rev: 'CAA98AD62474403DB962065A929377BB',
                    size: 2384,
                };

                it('使用提取码时只显示提取码相关字样', () => {
                    const wrapper = shallow(
                        <Mail
                            doc={ doc }
                            enableLinkAccessCode={ true }
                            link="288FEC854354798E2B146BE935C6462F"
                            accesscode="EabK"
                            mailto={ [] }
                        />
                    );

                    expect(wrapper.contains('You can send the extraction code by email:')).equals(true);
                    expect(wrapper.contains('You can send the external link by email:')).equals(false);
                });

                it('不使用提取码时只显示外链相关字样', () => {
                    const wrapper = shallow(
                        <Mail
                            doc={ doc }
                            enableLinkAccessCode={ false }
                            link="288FEC854354798E2B146BE935C6462F"
                            accesscode="EabK"
                            mailto={ [] }
                        />
                    );

                    expect(wrapper.contains('You can send the extraction code by email:')).equals(false);
                    expect(wrapper.contains('You can send the external link by email:')).equals(true);
                });

                it('正确传递邮箱', () => {
                    const mailto = [];
                    const onMailsChange = spy();
                    const wrapper = shallow(
                        <Mail
                            doc={ doc }
                            enableLinkAccessCode={ false }
                            link="288FEC854354798E2B146BE935C6462F"
                            accesscode="EabK"
                            mailto={ mailto }
                            onMailsChange={ onMailsChange }
                        />
                    );

                    expect(wrapper.find(ComboArea).prop('value')).equals(mailto)
                    expect(wrapper.find(ComboArea).prop('onChange')).equals(onMailsChange)
                });

                it('正确发送邮件', (done) => {
                    const onMailSendSuccess = () => {
                        done();
                    };

                    const wrapper = shallow(
                        <Mail
                            doc={ doc }
                            enableLinkAccessCode={ false }
                            link="288FEC854354798E2B146BE935C6462F"
                            accesscode="EabK"
                            mailto={ ['zhangsan@eisoo.com'] }
                            onMailSendSuccess={ onMailSendSuccess }
                        />
                    );

                    wrapper.find(Button).simulate('click');
                });
            })
        })
    })
})