import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import AccessList from '../component.desktop';
import * as styles from '../styles.desktop.css';
import __ from '../locale';

import { sandboxStub } from '../../../libs/test-helper';
import * as openapi from '../../../core/openapi/openapi';
import * as  download from '../../../core/download/download'

const sandbox = sinon.createSandbox();
describe('ShareWebComponent', () => {
    describe('AccessList', () => {

        beforeEach('stub 外部模块efshttp download', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: openapi,
                    moduleProp: 'efshttp'
                },
                {
                    moduleObj: download,
                    moduleProp: 'download'
                }
            ])
        })

        afterEach('restore stub', () => {
            sandbox.restore()
        })

        it('正确渲染顶部区域', () => {
            openapi.efshttp.resolves([])
            const wrapper = shallow(<AccessList />)
            expect(wrapper.find(`.${styles['header']} Icon`)).to.have.lengthOf(1)
            expect(wrapper.find(`.${styles['header']} label`).text()).to.equal(__('最多访问'))
        });

        it('加载数据时，显示加载提示，加载完成后隐藏', (done) => {
            openapi.efshttp.resolves([])
            const wrapper = shallow(<AccessList />)
            expect(wrapper.find(`.${styles['loading']}`)).to.have.lengthOf(1)
            setTimeout(() => {
                /* 更新视图，不显示加载提示 */
                wrapper.update()
                expect(wrapper.find(`.${styles['loading']}`)).to.have.lengthOf(0)
                done()
            }, 0);
        });

        it('返回数据为空时显示 暂无内容 提示', (done) => {
            openapi.efshttp.resolves([])
            const wrapper = shallow(<AccessList />)
            setTimeout(() => {
                /* 更新视图，不显示加载提示 */
                wrapper.update()
                expect(wrapper.find(`.${styles['empty']}`)).to.have.lengthOf(1)
                done()
            }, 0);
        });

        it('返回数据不为空时，正确渲染数据', (done) => {
            openapi.efshttp.resolves([
                {
                    docid: 'gns://test1docid',
                    name: 'test1.doc',
                    count: 99999999
                },
                {
                    docid: 'gns://test2docid',
                    name: 'test2.png',
                    count: 100000000
                }
            ])
            const previewSpy = sinon.spy()
            const wrapper = mount(<AccessList preview={previewSpy} />)
            setTimeout(() => {
                wrapper.update()
                const rows = wrapper.find('tr')
                /* 显示两行数据 */
                expect(wrapper.find('tr')).to.have.lengthOf(2)

                /* 每一行前面的小点 */
                expect(wrapper.find(`.${styles['dot']}`)).to.have.lengthOf(2)

                /* 文件名显示正确 */
                expect(rows.at(0).find('td').at(0).contains('test1.doc')).to.be.true
                expect(rows.at(1).find('td').at(0).contains('test2.png')).to.be.true

                /* 次数显示正确 */
                expect(rows.at(0).find('td').at(2).text()).to.equal(`99999999 ${__('次')}`)
                expect(rows.at(1).find('td').at(2).text()).to.equal(`99999999+ ${__('次')}`)

                /* 点击文件名，正确处理预览 */
                rows.at(0).find('LinkChip').simulate('click')

                expect(previewSpy.args[0][0]).to.deep.equal({
                    docid: 'gns://test1docid',
                    name: 'test1.doc',
                    count: 99999999,
                    isdir: false
                })

                /* 点击下载，正确处理下载 */
                rows.at(1).find('FontIcon').simulate('click')
                expect(download.download.args[0][0]).to.deep.equal({
                    docid: 'gns://test2docid',
                    name: 'test2.png',
                    count: 100000000,
                    isdir: false
                })
                done()
            }, 0);
        });

    });
});