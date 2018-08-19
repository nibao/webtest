import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CopyLink from '../../CopyLink/component.desktop';
import Configuration from './component.view';
import server from '../mockup';

declare const { describe, it }

describe('ShareWebComponents', () => {
    describe('<LinkShare />', () => {
        describe('<Configuration />', () => {
            describe('component.desktop.tsx', () => {
                it('使用外链，显示外链字样字样，不显示提取码字样', () => {
                    const wrapper = shallow(
                        <Configuration
                            status={ 0 }
                            doc={ { size: -1 } }
                            enableLinkAccessCode={ false }
                            accesscode={ false }
                            info={ {} }
                            template={ {} }
                        />
                    );

                    expect(wrapper.contains('Extraction Code:')).equals(false);
                    expect(wrapper.contains('external link:')).equals(true);
                })

                it('使用提取码，显示提取码字样，不显示外链字样', () => {
                    const wrapper = shallow(
                        <Configuration
                            status={ 0 }
                            doc={ { size: -1 } }
                            accesscode={ true }
                            info={ {} }
                            template={ {} }
                        />
                    );

                    expect(wrapper.contains('Extraction Code:')).equals(true);
                    expect(wrapper.contains('external link:')).equals(false);
                });

                it('使用提取码，复制链接地址显示提取码', () => {
                    const wrapper = shallow(
                        <Configuration
                            status={ 0 }
                            doc={ { size: -1 } }
                            accesscode="E1aK"
                            template={ {} }
                        />
                    );

                    expect(wrapper.containsMatchingElement(<CopyLink accesscode="E1aK" />)).equals(true)
                })

                it('使用外链，复制链接地址显示外链', () => {
                    const wrapper = shallow(
                        <Configuration
                            status={ 0 }
                            doc={ { size: -1 } }
                            link="065617D1AE25C1B93874E068581113F3"
                            endtime={ 1504454399000000 }
                            template={ {} }
                        />
                    );

                    expect(wrapper.find('CopyLink').prop('link')).equals('065617D1AE25C1B93874E068581113F3')
                })
            })
        })
    })
})