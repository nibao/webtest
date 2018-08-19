/// <reference path="./component.base.d.ts" />

import * as React from 'react'
import WebComponent from '../webcomponent';
import { Status } from './helper'
import { getComment, submitComment, deleteComment } from '../../core/apis/efshttp/file/file'
import { assign } from 'lodash'
import __ from './locale'

export default class CommentBase extends WebComponent<Components.Comment.Props, any> implements Components.Comment.Base {
    constructor(props, context) {
        super(props, context)
        this.textArea = null
        this.state = {
            averagescore: 0,
            comments: [],
            hasscored: false,
            mode: 0,
            score: 0,
            answerContent: '',
            answerToName: '',
            answerToComment: null,
            tempDeleteComment: null,
            status: Status.NORMAL,
            errCodes: []
        }
    }

    componentDidMount() {
        let { doc } = this.props
        if (doc && doc.size !== -1) {
            this.updateComments(doc.docid)
        }
    }

    componentWillReceiveProps(nextProps) {
        let { doc } = nextProps
        if (doc && doc.size !== -1 && (this.props.doc && doc.docid !== this.props.doc.docid || !this.props.doc)) {
            this.updateComments(doc.docid)
        }
    }

    updateComments(docid) {
        getComment({ docid: docid }).then(commentInfo => {
            const { averagescore, hasscored, mode, comments } = commentInfo
            this.setState({
                averagescore: averagescore || 0,
                hasscored: hasscored || false,
                mode,
                comments: comments || []
            })
        })
    }

    handleSetTextAreaRef(el) {
        this.textArea = el
    }

    handleAnswerTo(comment) {
        let { commentatorid, commentator } = comment
        if (this.state.answerToComment && commentatorid !== this.state.answerToComment.commentatorid || !this.state.answerToComment) {
            this.setState({
                answerToComment: comment,
                answerToName: __('回复 ${name}：', { name: commentator }),
                answerContent: ''
            })
        } else {
            this.setState({
                answerToComment: comment,
                answerToName: __('回复 ${name}：', { name: commentator })
            })
        }
        this.textArea.focus()
    }

    handleDelete(tempDeleteComment) {
        this.setState({
            status: Status.CONFIRM_DELETE_COMMENT,
            tempDeleteComment
        })
    }

    handleConfirmDelete() {
        const { userid, tokenid, doc } = this.props
        deleteComment({
            docid: doc.docid,
            commentid: this.state.tempDeleteComment.id
        }, { userid, tokenid }).then(() => {
            this.setState({
                status: Status.NORMAL
            })
            this.updateComments(doc.docid)
        }, err => {
            this.setState({
                status: Status.NORMAL,
                errCodes: this.state.errCodes.concat(err.errcode)
            })
        })
    }

    handleCancelDelete() {
        this.setState({
            status: Status.NORMAL
        })
    }

    handleConfirmError() {
        this.setState({
            errCodes: this.state.errCodes.slice(1)
        })
    }

    handleStar(score) {
        this.setState({
            score
        })
    }

    handleCommentBoxChange(value) {
        if (this.state.answerToComment) {
            let contentBegin = value.slice(0, this.state.answerToName.length)
            if (contentBegin === this.state.answerToName) {
                let answerContent = value.slice(contentBegin.length)
                this.setState({
                    answerContent
                })
            }
        } else {
            this.setState({
                answerContent: value
            })
        }
    }

    handleCancel() {
        this.setState({
            answerToName: '',
            answerContent: '',
            score: 0,
            answerToComment: null
        })
    }

    handleComment() {
        const { userid, tokenid, doc } = this.props,
            { answerToComment, score, answerContent } = this.state
        submitComment(assign(
            { docid: doc.docid },
            answerToComment ? { answertoid: answerToComment.commentatorid } : {},
            score ? { score } : {},
            answerContent ? { comment: answerContent.trim() } : {}
        ), { userid, tokenid }).then(() => {
            this.updateComments(doc.docid)
            this.setState({
                answerToName: '',
                answerContent: '',
                score: 0,
                answerToComment: null
            })
        }, err => {
            this.setState({
                errCodes: this.state.errCodes.concat(err.errcode)
            })
        })
    }
}