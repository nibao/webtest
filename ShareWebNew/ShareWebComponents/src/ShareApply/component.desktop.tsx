import * as React from 'react';
import ApplyList from './ApplyList/component.desktop';
import ToolBar from './ToolBar/component.desktop';
import ShareApplyBase from './component.base';
import * as styles from './styles.desktop.css';

export default class ShareApply extends ShareApplyBase {
    render() {
        const { doDirOpen, doDownload } = this.props
        const { type, filterResults, selection, searchValue, searchKey, } = this.state

        return (
            <div className={styles['container']}>
                <ToolBar
                    type={type}
                    keys={['name', 'security', 'requestType', 'requestContent', 'reviewer']}
                    searchKey={searchKey}
                    searchValue={searchValue}
                    renderOption={this.handleRenderOption.bind(this)}
                    renderComboItem={this.handleRenderComboItem.bind(this)}
                    doTypeChange={(type) => { this.handleTypeChange(type) }}
                    doFilterResultChange={(searchValue) => { this.handleFilterResultChange(searchValue) }}
                />
                <ApplyList
                    type={type}
                    docs={filterResults}
                    selection={selection}
                    onSelectionChange={(selection) => { this.setState({ selection: selection.detail }) }}
                    doDirOpen={doDirOpen}
                    doFilePreview={(e, record) => { this.handleFilePreview(record) }}
                    onRowDoubleClicked={(e) => { this.handleFilePreview(e.detail.record) }}
                    doDownload={doDownload}
                    keys={['name', 'security', 'requestType', 'requestContent', 'reviewer']}
                    searchKey={searchKey}
                    searchValue={searchValue}
                    renderOption={this.handleRenderOption.bind(this)}
                    renderComboItem={this.handleRenderComboItem.bind(this)}
                    doTypeChange={(type) => { this.handleTypeChange(type) }}
                    doFilterResultChange={(searchValue) => { this.handleFilterResultChange(searchValue) }}
                />
            </div>
        )
    }
}