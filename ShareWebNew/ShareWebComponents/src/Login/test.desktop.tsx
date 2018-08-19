import * as React from 'react';
import { noop } from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Login from './component.desktop';
import ChangePassword from './ChangePassword/component.desktop';
import fakeServer from './mockup';

declare const { describe, it, before, after }

describe('ShareWebComponents', () => {
    describe('<Login />', () => {
        describe('component.desktop.tsx', () => {
            before(fakeServer.start);
            after(fakeServer.stop);

            it('认证成功', (done) => {
                const spy = ({ userid, tokenid, account }) => {
                    expect(userid).to.equal('2a664704-5e18-11e3-a957-dcd2fc061e41');
                    expect(tokenid).to.equal('cf3aba7b-4781-420e-b88a-f4f3c4ebfe60');
                    expect(account).to.equal('mao.zhengyang@eisoo.com');
                    done();
                };

                const wrapper = shallow(<Login onSuccess={ spy } />);

                wrapper.find('input').at(0).simulate('change', { target: { value: 'test' } })
                wrapper.find('input').at(1).simulate('change', { target: { value: 'eisoo.com' } })
                wrapper.find('form').simulate('submit', { preventDefault: noop });

            });

            it('帐号或密码错误', (done) => {
                const wrapper = shallow(<Login />);

                wrapper.find('input').at(0).simulate('change', { target: { value: 'wrongPassword' } })
                wrapper.find('input').at(1).simulate('change', { target: { value: 'eisoo.com' } })
                wrapper.find('form').simulate('submit', { preventDefault: noop });

                setTimeout(() => {
                    expect(wrapper.contains('Incorrect username or password')).to.equal(true)
                    done();
                }, 100)

            });

            it('密码过期', (done) => {
                const wrapper = shallow(<Login />);

                wrapper.find('input').at(0).simulate('change', { target: { value: 'expiredPassword' } })
                wrapper.find('input').at(1).simulate('change', { target: { value: 'eisoo.com' } })
                wrapper.find('form').simulate('submit', { preventDefault: noop });

                setTimeout(() => {
                    expect(wrapper.containsMatchingElement(<ChangePassword errorCode={ 401012 } />)).to.equal(true);
                    done();
                }, 100)

            });

            it('密码强度过低', (done) => {
                const wrapper = shallow(<Login />);

                wrapper.find('input').at(0).simulate('change', { target: { value: 'lowPassword' } })
                wrapper.find('input').at(1).simulate('change', { target: { value: 'eisoo.com' } })
                wrapper.find('form').simulate('submit', { preventDefault: noop });

                setTimeout(() => {
                    expect(wrapper.containsMatchingElement(<ChangePassword errorCode={ 401013 } />)).to.equal(true);
                    done();
                }, 100)

            });

            it('使用初始密码登录', (done) => {
                const wrapper = shallow(<Login />);

                wrapper.find('input').at(0).simulate('change', { target: { value: 'initialPassword' } })
                wrapper.find('input').at(1).simulate('change', { target: { value: '123456' } })
                wrapper.find('form').simulate('submit', { preventDefault: noop });

                setTimeout(() => {
                    expect(wrapper.containsMatchingElement(<ChangePassword errorCode={ 401017 } />)).to.equal(true);
                    done();
                }, 100)
            });
        })
    });
});