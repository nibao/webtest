import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgressBar from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('ProgressBar@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ProgressBar></ProgressBar>)
            })
            it('传入value时，正确渲染自定义文本，正确渲染进度', () => {
                let wrapper: ShallowWrapper;
                let width: string;
                wrapper = shallow(<ProgressBar value={0}></ProgressBar>)
                width = wrapper.find('div>div').at(1).prop('style').width
                expect(wrapper.find('div>div').at(0).text()).to.equal('0%')
                expect(Math.abs(Number(width.slice(0, -1)) - 0)).to.most(0.0001) /* JS精度的问题 */


                wrapper = shallow(<ProgressBar value={0.009}></ProgressBar>)
                width = wrapper.find('div>div').at(1).prop('style').width
                expect(wrapper.find('div>div').at(0).text()).to.equal('1%')
                expect(Math.abs(Number(width.slice(0, -1)) - 0.9)).to.most(0.0001) /* JS精度的问题 */

                wrapper = shallow(<ProgressBar value={0.999}></ProgressBar>)
                width = wrapper.find('div>div').at(1).prop('style').width
                expect(wrapper.find('div>div').at(0).text()).to.equal('100%')
                expect(Math.abs(Number(width.slice(0, -1)) - 99.9)).to.most(0.0001) /* JS精度的问题 */

            });
        })
    });
});