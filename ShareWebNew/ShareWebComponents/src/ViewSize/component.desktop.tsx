import * as React from 'react';
import InvalidTipMessage from '../InvalidTipMessage/component.desktop'
import Content from './Content/component.desktop';
import ViewSizeBase from './component.base';

export default class ViewSize extends ViewSizeBase {

    render() {
        return (
            <div>
                {
                    !this.state.showError ?
                        <Content
                            onClose={this.cancel.bind(this)}
                            onConfirm={this.confirm.bind(this)}
                            onCancel={this.cancel.bind(this)}
                            isQuering={this.state.isQuering}
                            filenum={this.state.size.filenum}
                            dirnum={this.state.size.dirnum}
                            totalsize={this.state.size.totalsize}
                            recyclesize={this.state.size.recyclesize}
                            onlyrecycle={this.props.onlyrecycle}
                        >
                        </Content>
                        :
                        <InvalidTipMessage
                            onConfirm={this.close.bind(this)}
                            errorCode={this.state.errorCode}
                            errorDoc={this.state.errorDoc}
                            onlyrecycle={this.props.onlyrecycle}
                        />

                }
            </div>
        )

    }

}