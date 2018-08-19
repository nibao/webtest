import * as React from 'react'
import CommentBase from './component.base'
import Star from '../../ui/Star/ui.desktop'
import Icon from '../../ui/Icon/ui.desktop'
import FontIcon from '../../ui/FontIcon/ui.desktop'
import Button from '../../ui/Button/ui.desktop'
import FlexBox from '../../ui/FlexBox/ui.desktop'
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop'
import MessageDialog from '../../ui/MessageDialog/ui.desktop'
import { formatTime } from '../../util/formatters/formatters'
import session from '../../util/session/session';
import { getErrorMessage } from '../../core/errcode/errcode'
import __ from './locale'
import { Status, Mode } from './helper'
import { get, sum } from 'lodash'
import '../../assets/fonts/font.css'
import * as styles from './styles.desktop.css'
import * as userSmallImg from './assets/images/user_s.png'
import * as userLargeImg from './assets/images/user_l.png'
import * as delImg from './assets/images/del.png'
import * as msgImg from './assets/images/msg.png'
import * as solidStarImg from './assets/images/star_solid.png'
import * as dashedStarImg from './assets/images/star_dashed.png'
import * as solidStarImgHighLight from './assets/images/star_solid_highlight.png'
import * as dashedStarImgHighLight from './assets/images/star_dashed_highlight.png'

/**
 * 文件总评分
 */
const CommentStar = ({ mode, averageScore }) => (
    <div>
        {
            mode === Mode.ENABLE_RATE || mode === Mode.ENABLE_BOTH
                ? <div className={styles['comment-star']}>
                    <h3 className={styles['average-score']}>{averageScore !== 0 ? __('文件总评分：${score} 分', { score: averageScore.toFixed(1) }) : __('文件总评分：---')}</h3>
                    {
                        averageScore !== 0
                            ? <div className={styles['average-star']}>
                                <Star score={averageScore.toFixed(1)} size="24px" color="#ff9900" dashed={'\uf005'} solid={'\uf006'} solidFallback={solidStarImgHighLight} dashedFallback={dashedStarImgHighLight} />
                            </div>
                            : null
                    }
                </div>
                : null
        }
    </div>
)

/**
 * 文件评论列表
 */
const CommentList = ({ mode, userid, averageScore, hasScored, answerToName, answerContent, comments, onAnswerTo, onDelete }) => (
    <div
        className={styles['comment-list']}
        style={{
            top: `${(mode === Mode.ENABLE_RATE || mode === Mode.ENABLE_BOTH)
                ? averageScore === 0
                    ? 50 // 无评分
                    : 82 // 有评分
                : 0 // 未开启评分
            }px`,
            bottom: `${sum([
                mode === Mode.DISABLE || mode === Mode.ENABLE_RATE && hasScored ? 0 : 47, // 边框及按钮高度
                (mode & Mode.ENABLE_RATE) === Mode.ENABLE_RATE && !hasScored ? 38 : 0, // 星星高度
                (mode & Mode.ENABLE_COMMENT) === Mode.ENABLE_COMMENT ? 88 : 0, // 评论框高度
                answerContent.length > 300 ? 25 : 0 // 超出字数提示高度
            ])}px`
        }}>
        {
            comments.length
                ? <ul>
                    {
                        comments.map(comment => (
                            <li className={styles['comment-item']} key={comment.id}>
                                <a href="javascript:;" className={styles['comment-link']}>
                                    <div className={styles['userimg-wrapper']}>
                                        <Icon size="24px" url={userSmallImg} />
                                    </div>
                                    <div className={styles['comment-wrapper']}>
                                        <div className={styles['comment-main']}>
                                            <span className={styles['username']}>{comment.commentator}</span>
                                            {
                                                comment.answerto ? <span className={styles['answer']}>{__('回复')}</span> : null
                                            }
                                            {
                                                comment.answerto ? <span className={styles['username']}>{comment.answerto}</span> : null
                                            }
                                            <span>{__('：')}</span>
                                            {
                                                comment.score !== -1 && (mode === Mode.ENABLE_RATE || mode === Mode.ENABLE_BOTH) ? <span><Star score={comment.score} color={'#aaa'} size="16px" dashed={'\uf005'} solid={'\uf006'} solidFallback={solidStarImg} dashedFallback={dashedStarImg} /><br /></span> : null
                                            }
                                            {
                                                (mode === Mode.ENABLE_COMMENT || mode === Mode.ENABLE_BOTH)
                                                    ? comment.comment.split('\n').map((para, index) => <p className={styles['comment-para']} key={index}>{para}</p>)
                                                    : null
                                            }
                                        </div>
                                        <div className={styles['comment-footer']}>
                                            <div className={styles['comment-time']}>{formatTime(comment.time / 1000, "yyyy-MM-dd HH:mm")}</div>
                                            <div className={styles['comment-action']}>
                                                {
                                                    (mode === Mode.ENABLE_COMMENT || mode === Mode.ENABLE_BOTH) && comment.comment
                                                        ? <FontIcon font={'AnyShare'} fallback={msgImg} size="20px" code={'\uf001'} title={__('回复')} className={styles['action-btn']} onClick={() => { onAnswerTo(comment) }} />
                                                        : null
                                                }
                                                {
                                                    comment.commentatorid === userid
                                                        ? <FontIcon font={'AnyShare'} fallback={delImg} size="20px" code={'\uf000'} title={__('删除')} className={styles['action-btn']} onClick={() => { onDelete(comment) }} />
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))
                    }
                </ul>
                : <div className={styles['comment-empty']}>
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <FontIcon font={'AnyShare'} fallback={msgImg} size="50px" code={'\uf001'} className={styles['comment-empty-icon']} />
                            <p>{__('暂时还没有任何评论哦~')}</p>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
        }
    </div >
)

/**
 * 文件评论框
 */
const CommentBox = ({ mode, hasScored, answerToName, answerContent, score, onSetTextAreaRef, onStar, onCommentBoxChange, onCancel, onComment }) => (
    <div>
        {
            (mode && !(mode === Mode.ENABLE_RATE && hasScored))
                ? <div className={styles['comment-box']}>
                    <div className={styles['userimg-wrapper']}>
                        <Icon size="30px" url={userLargeImg} />
                    </div>
                    <div className={styles['comment-wrapper']}>
                        {
                            mode !== Mode.ENABLE_COMMENT && !hasScored && !answerToName
                                ? <div className={styles['star-wrapper']}>
                                    <Star score={score} onStar={onStar} size="30px" color="#ff9900" dashed={'\uf005'} solid={'\uf006'} solidFallback={solidStarImgHighLight} dashedFallback={dashedStarImg} />
                                </div>
                                : null
                        }
                        {
                            mode !== Mode.ENABLE_RATE
                                ? <div className={styles['answerbox-wrapper']}>
                                    <textarea
                                        ref={onSetTextAreaRef}
                                        className={styles['textarea']}
                                        placeholder={__('最多可输入300字')}
                                        onChange={e => onCommentBoxChange(e.target.value)}
                                        value={answerToName + answerContent}
                                        type="text"></textarea>
                                </div>
                                : null
                        }
                        {
                            answerContent.trim().length > 300
                                ? <div className={styles['limitation-tip']}>{__('已超出 ${number} 字', { number: answerContent.trim().length - 300 })}</div>
                                : null
                        }
                        <div className={styles['action-wrapper']}>
                            <div className={styles['btn-wrapper']}>
                                <Button type="submit" onClick={onComment} disabled={!(score || answerContent.trim()) || answerContent.trim().length > 300}>{__('发表')}</Button>
                            </div>
                            <div className={styles['btn-wrapper']}>
                                <Button onClick={onCancel}>{__('取消')}</Button>
                            </div>
                        </div>
                    </div>
                </div>
                : null
        }
    </div>
)

/**
 * 删除确认对话框
 */
const ComfirmDeleteDialog = ({ show, onConfirmDelete, onCancelDelete }) => (
    <div>
        {
            show ?
                (
                    <ConfirmDialog onConfirm={onConfirmDelete} onCancel={onCancelDelete}>
                        {__('确定要删除该条评论吗？')}
                    </ConfirmDialog>
                ) :
                null
        }
    </div>
)


/**
 * 请求出错对话框
 */
const ErrorMessages = ({ show, onConfirmError, errCode }) => (
    <div>
        {
            show ?
                (
                    <MessageDialog onConfirm={onConfirmError}>
                        {getErrorMessage(errCode)}
                    </MessageDialog>
                ) :
                null
        }
    </div>
)

/**
 * 文件评论组件
 */
export default class Comment extends CommentBase {
    render() {
        let { doc } = this.props,
            { averagescore, hasscored, comments, mode, answerToName, answerContent, score, status, errCodes } = this.state
        return (
            <div className={styles['container']}>
                {
                    doc && doc.size !== -1
                        ? <div className={styles['wrapper']}>
                            <CommentStar mode={mode} averageScore={averagescore} />
                            <CommentList
                                mode={mode}
                                userid={this.props.userid || session.get('userid')}
                                averageScore={averagescore}
                                hasScored={hasscored}
                                answerToName={answerToName}
                                answerContent={answerContent}
                                comments={comments}
                                onAnswerTo={this.handleAnswerTo.bind(this)}
                                onDelete={this.handleDelete.bind(this)} />
                            <CommentBox
                                mode={mode}
                                hasScored={hasscored}
                                answerToName={answerToName}
                                answerContent={answerContent}
                                score={score}
                                onSetTextAreaRef={this.handleSetTextAreaRef.bind(this)}
                                onStar={this.handleStar.bind(this)}
                                onCommentBoxChange={this.handleCommentBoxChange.bind(this)}
                                onCancel={this.handleCancel.bind(this)}
                                onComment={this.handleComment.bind(this)} />
                            <ComfirmDeleteDialog show={status === Status.CONFIRM_DELETE_COMMENT} onConfirmDelete={this.handleConfirmDelete.bind(this)} onCancelDelete={this.handleCancelDelete.bind(this)} />
                            <ErrorMessages show={errCodes.length} errCode={errCodes[0]} onConfirmError={this.handleConfirmError.bind(this)} />
                        </div>
                        : <div>
                            <div className={styles['wrapper']}>
                                <p className={styles['comment-list-empty']}>{__('评论列表为空')}</p>
                            </div>
                        </div>
                }
            </div>
        )
    }
}