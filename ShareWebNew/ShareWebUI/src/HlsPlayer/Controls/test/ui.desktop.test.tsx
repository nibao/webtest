import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Controls from '../ui.desktop';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('Controls@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Controls />);
            })

            it('应该包含正确的控件（播放暂停，时间，进度条，静音，音量，全屏）', () => {
                const wrapper = shallow(<Controls />);
                /* 音量按钮默认为暂停按钮 */
                expect(wrapper.find('div>div').at(0).find('UIIcon').prop('code')).to.equal('\uf035')

                /* 时间 */
                expect(wrapper.find('div>div').at(0).find('span').exists()).to.be.true

                /* 进度条 */
                expect(wrapper.find('div>div').at(1).find('Slider').exists()).to.be.true

                /* 静音控制，默认非静音 */
                expect(wrapper.find('div>div').at(2).find('UIIcon').at(0).prop('code')).to.equal('\uf037')

                /* 音量 */
                expect(wrapper.find('div>div').at(2).find('Slider').exists()).to.be.true

                /* 全屏按钮，默认非全屏 */
                expect(wrapper.find('div>div').at(2).find('UIIcon').at(1).prop('code')).to.equal('\uf038')
            });

            it('传入paused props为true时，渲染暂停按钮', () => {
                const wrapper = shallow(<Controls paused={true} />);
                expect(wrapper.find('div>div').at(0).find('UIIcon').prop('code')).to.equal('\uf034')
            });

            it('传入muted props为true时，渲染静音按钮', () => {
                const wrapper = shallow(<Controls muted={true} />);
                expect(wrapper.find('div>div').at(2).find('UIIcon').at(0).prop('code')).to.equal('\uf036')
            });

            it('传入fullScreen props时，渲染全屏按钮', () => {
                const wrapper = shallow(<Controls fullScreen={true} />);
                expect(wrapper.find('div>div').at(2).find('UIIcon').at(1).prop('code')).to.equal('\uf039')
            });

            it('时间渲染正确', () => {
                const wrapper = shallow(<Controls duration={3666} currentTime={10} />);
                expect(wrapper.find('div>div').at(0).find('span').text()).to.equal('0:00:10 / 1:01:06')
            });

        })

        describe('#event', () => {
            describe('点击播放按钮，正确调用onplay', () => {
                it('未播放到结束时，onplay调用参数为当前播放时间', () => {
                    const spy = sinon.spy();
                    const wrapper = shallow(<Controls paused={true} ended={false} currentTime={123} onPlay={spy} />);
                    wrapper.find('div>div').at(0).find('UIIcon').simulate('click');
                    expect(spy.calledWith(123)).to.be.true
                });
                it('播放到结束时，onplay调用参数为0', () => {
                    const spy = sinon.spy();
                    const wrapper = shallow(<Controls paused={true} ended={true} currentTime={123} onPlay={spy} />);
                    wrapper.find('div>div').at(0).find('UIIcon').simulate('click');
                    expect(spy.calledWith(0)).to.be.true
                });
            });
            it('点击暂停按钮，正确调用onPause', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Controls paused={false} onPause={spy} />);
                wrapper.find('div>div').at(0).find('UIIcon').simulate('click');
                expect(spy.called).to.be.true
            });

            it('点击静音切换按钮，正确调用onMute', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Controls onMute={spy} />);
                wrapper.find('div>div').at(2).find('UIIcon').at(0).simulate('click');
                expect(spy.called).to.be.true
            });
            
            it('点击全屏切换按钮，正确调用onToggleFullScreen', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Controls onToggleFullScreen={spy} />);
                wrapper.find('div>div').at(2).find('UIIcon').at(1).simulate('click');
                expect(spy.called).to.be.true
            });

        });
    });
});