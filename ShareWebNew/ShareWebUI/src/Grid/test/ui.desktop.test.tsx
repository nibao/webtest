import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Grid from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Grid@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Grid></Grid>)
            })

            it('默认显示为4列', () => {
                const wrapper = shallow(
                    <Grid>
                        <span>test</span>
                        <span>test</span>
                        <span>test</span>
                        <span>test</span>
                        <span>test</span>
                    </Grid>
                );
                expect(wrapper.find('div>div').filterWhere(n => n.parents().length === 1).at(0).find('span')).to.have.lengthOf(4)
                expect(wrapper.find('div>div').filterWhere(n => n.parents().length === 1).at(1).find('span')).to.have.lengthOf(1)
            });

            it('支持自定义列数', () => {
                const wrapper = shallow(
                    <Grid cols={5}>
                        <span>test</span>
                        <span>test</span>
                        <span>test</span>
                        <span>test</span>
                        <span>test</span>
                    </Grid>
                );
                expect(wrapper.find('div>div').filterWhere(n => n.parents().length === 1).at(0).find('span')).to.have.lengthOf(5)
                expect(wrapper.find('div>div').filterWhere(n => n.parents().length === 1)).to.have.lengthOf(1)

            });
        })
    });
});