import * as React from 'react';
import Active from './Active/component.desktop';
import Switch from './Switch/component.desktop';
import ClientDemoBase from './component.base';

export default class ClientDemo extends ClientDemoBase {
    render() {
        return (
            <div>
                {
                    this.state.active ? (
                        <Active
                            onConfirm={this.setState({ active: false })}
                        />
                    ) : null
                }
                <Switch
                    active={this.state.active}
                    onSwitch={active => this.setState({ active })}
                />
            </div>
        )
    }
}