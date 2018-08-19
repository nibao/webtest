import * as React from 'react';
import { noop } from 'lodash';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import { spy } from 'sinon';
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import PermConfig from './component.desktop';

declare const { describe, it };

describe('ShareWebComponents', () => {
    describe('<LinkShare />', () => {
        describe('<PermConfig />', () => {
            describe('component.desktop.tsx', () => {
                const baseProps = {
                    doc: { size: 0 },
                    perm: 1,
                    template: { allowPerms: 7 },
                    onPermsChange: noop,
                }

                it('外链共享的对象是文件，不显示上传权限', () => {
                    const onPermsChange = spy();

                    const wrapper = shallow(
                        <PermConfig
                            {...baseProps}
                            doc={ { size: 1024 } }
                        />
                    );

                    expect(wrapper.containsMatchingElement(<CheckBoxOption value={ 4 }>Upload</CheckBoxOption>)).equals(false)
                });

                it('外链共享的对象是目录，显示上传权限', () => {
                    const wrapper = shallow(
                        <PermConfig
                            {...baseProps}
                            doc={ { size: -1 } }
                        />
                    );

                    expect(wrapper.containsMatchingElement(<CheckBoxOption value={ 4 }>Upload</CheckBoxOption>)).equals(true)
                })

                it('正确勾选权限复选框', () => {
                    const wrapper = shallow(
                        <PermConfig
                            {...baseProps}
                            doc={ { size: -1 } }
                            perm={ 7 }
                        />
                    );

                    expect(wrapper.containsMatchingElement(<CheckBoxOption value={ 1 } checked={ true }>Preview</CheckBoxOption>)).equals(true)
                    expect(wrapper.containsMatchingElement(<CheckBoxOption value={ 2 } checked={ true }>Download</CheckBoxOption>)).equals(true)
                    expect(wrapper.containsMatchingElement(<CheckBoxOption value={ 4 } checked={ true }>Upload</CheckBoxOption>)).equals(true)
                });
            })
        })
    })
})