import * as React from 'react';
import '../../../assets/fonts/font.css';
import Dialog from '../../../ui/Dialog2/ui.desktop'
import ContactAdderView from './component.view';
import ContactAdderBase from './component.base';
import __ from './locale';


export default class ContactAdder extends ContactAdderBase {
    render() {
        const { candidates } = this.state;

        return (
            <Dialog
                width={'600px'}
                title={__('搜索用户')}
                onClose={this.props.onAddContactCancel}
            >
                <ContactAdderView
                    candidates={candidates}
                    onAddContactCancel={this.props.onAddContactCancel}
                    clearCandidates={this.clearCandidates.bind(this)}
                    removeCandidate={this.removeCandidate.bind(this)}
                    submitCandidates={this.submitCandidates.bind(this)}
                    handleAddCandidate={this.handleAddCandidate.bind(this)}
                />
            </Dialog>
        )
    }
}