import * as React from 'react';
import { fitSize } from '../../util/nw/nw';
import NWWindow from '../../ui/NWWindow/ui.client';
import Active from './Active/component.client';
import Switch from './Switch/component.client';
import ClientDemoBase from './component.base';

export default class ClientDemo extends ClientDemoBase {
    render() {
        return (
            <div>
                {
                    this.state.active ? (
                        <NWWindow
                            onOpen={nwWindow => this.nwWindow = nwWindow}
                        >
                            <Active
                                onResize={({ width, height }) => fitSize(this.nwWindow, { width, height })}
                                onConfirm={() => this.setState({ active: false })}
                            />
                        </NWWindow>
                    ) : 'INACTIVE'
                }
                <Switch
                    active={this.state.active}
                    onSwitch={active => this.setState({ active })}
                    onClose={this.props.onClose}
                />
            </div>
        )
    }
}