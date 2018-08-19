import * as React from 'react'
import { MessageType, getMessages, subscribe } from '../../core/message/message'
import { subscribe as subscribeApproval, getApprovalsCountsByType, ReviewType } from '../../core/audit/audit'

export default class SideNavBase extends React.Component<Components.SideNav.Props, Components.SideNav.State> {

    static defaultProps = {
        nav: []
    }

    state = {
        specificMsgNum: {
            shareMsgNum: 0,
            checkMsgNum: 0,
            securityMsgNum: 0,
        },
        auditNum: {
            shareApv: 0,
            flowApv: 0
        }
    }

    async componentWillMount() {
        this.setState({
            specificMsgNum: {
                shareMsgNum: getMessages(MessageType.Share, false).length,
                checkMsgNum: getMessages(MessageType.Check, false).length,
                securityMsgNum: getMessages(MessageType.Security, false).length,
            },
            auditNum: {
                shareApv: getApprovalsCountsByType(ReviewType.ShareApvUnreview),
                flowApv: getApprovalsCountsByType(ReviewType.FlowApvUnreview)
            }
        })

        subscribe(() => {
            this.setState({
                specificMsgNum: {
                    shareMsgNum: getMessages(MessageType.Share, false).length,
                    checkMsgNum: getMessages(MessageType.Check, false).length,
                    securityMsgNum: getMessages(MessageType.Security, false).length,
                }
            })
        })

        subscribeApproval(async () => {
            this.setState({
                auditNum: {
                    shareApv: getApprovalsCountsByType(ReviewType.ShareApvUnreview),
                    flowApv: getApprovalsCountsByType(ReviewType.FlowApvUnreview)
                }
            })
        })
    }
}



