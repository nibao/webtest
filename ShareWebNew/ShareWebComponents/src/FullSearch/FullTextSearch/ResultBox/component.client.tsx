import * as React from 'react';
import ResultBoxBase from './component.base';
import ResultBoxView from './component.view';

export default class ResultBox extends ResultBoxBase {

    render() {
        let { count, resultDocs, resultHighlight, resultCollections, resultTagsShown, isLoading, keysfields } = this.props;

        let { resultSelection, sortSelection } = this.state;
        return (
            <ResultBoxView
                count={count}
                client={true}
                isLoading={isLoading}
                resultDocs={resultDocs}
                keysfields={keysfields}
                sortSelection={sortSelection}
                resultHighlight={resultHighlight}
                resultSelection={resultSelection}
                resultTagsShown={resultTagsShown}
                resultCollections={resultCollections}
                handleLinkToFilePath={this.props.doDirOpen}
                handlePreviewFile={this.props.doFilePreview}
                onLazyLoad={this.props.onLazyLoad.bind(this)}
                onGetLazyLoadRef={this.props.onGetLazyLoadRef}
                onWarningChange={this.props.onWarningChange.bind(this)}
                handleSelectResult={this.handleSelectResult.bind(this)}
                handleClickAddTags={this.handleClickAddTags.bind(this)}
                handleClickShowTags={this.handleClickShowTags.bind(this)}
                handleClickLinkButton={this.handleClickLinkButton.bind(this)}
                handleClickShareButton={this.handleClickShareButton.bind(this)}
                handleClickSortSelection={this.handleClickSortSelection.bind(this)}
                handleClickCollectButton={this.handleClickCollectButton.bind(this)}
                handleClickDownloadButton={this.handleClickDownloadButton.bind(this)}
            />
        )
    }
}