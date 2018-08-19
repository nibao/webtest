import * as React from 'react'
import TagBoxBase, { Status } from '../../TagBox/component.base'
import TagEditorBase from '../../TagEditor/component.desktop';
import TagAdder from '../../TagAdder/component.desktop';
import Overlay from '../../../ui/Overlay/ui.desktop';
import ExceptionStrategy from '../../ExceptionStrategy/component.desktop'
import TagBoxErrorDialog from '../../TagBox/TagBoxErrorDialog/component.desktop'
import __ from '../../TagBox/locale'

class TagEditer extends TagEditorBase {
    componentWillReceiveProps({ tags }) {
        if (tags !== this.props.tags) {
            this.setState({
                tags
            })
        }
    }
}

export default class TagBox extends TagBoxBase {

    componentDidMount() {
        const { docs } = this.props
        if (docs && docs.length === 1) {
            this.showTags(docs[0])
        }
    }

    componentWillReceiveProps({ docs }) {
        if (docs && docs.length === 1) {
            this.showTags(docs[0])
        }
    }

    handleConfirmError() {
        this.setState({ errCode: null })
        this.props.onEditComplete()
    }

    render() {
        const { docs } = this.props
        const { status, tags, showEditDialog, showAdderDialog, exception, strategies, showSuccessMessage, processingDoc, errCode } = this.state;
        return (
            <div>
                {
                    docs && docs.length === 1 ?
                        <TagEditer
                            doc={this.props.docs[0]}
                            tags={tags ? tags : []}
                            onClose={this.props.onEditComplete}
                            onUpdateTags={this.updateTags.bind(this)}
                        />
                        : null
                }
                {
                    docs && docs.length > 1 ?
                        <TagAdder
                            onClose={this.props.onEditComplete}
                            onConfirm={this.addTags.bind(this)}
                        />
                        : null
                }
                {
                    errCode ?
                        <TagBoxErrorDialog
                            errCode={errCode}
                            onConfirm={this.handleConfirmError.bind(this)}
                        />
                        : null
                }
                {
                    exception ?
                        <ExceptionStrategy
                            exception={exception}
                            doc={processingDoc}
                            handlers={this.handlers}
                            strategies={strategies}
                            onConfirm={this.updateStrategies.bind(this)}
                        />
                        : null
                }
                {
                    showSuccessMessage ?
                        <Overlay position="top center">{__('添加标签成功。')}</Overlay>
                        : null
                }
            </div>
        )
    }
}