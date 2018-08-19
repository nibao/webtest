/**
 * 路由组件 map
 */
import * as React from 'react'
import RootView from './Root/view'
import IndexView from './Index/view'
import LoginView from './Login/view'
import HomeView from './Home/view'
import DocsView from './Docs/view'
import InfoView from './Info/view'
import LinkView from './Link/view'
import GetFiles from './GetFiles/view'
import MyFavoritesView from './MyFavorites/view'
import ShareApplyView from './ShareApply/view'
import MyShareView from './MyShare/view'
import { ShareMessages, SecurityMessages, CheckMessages } from './Messages/view'
import SearchView from './Search/view'
import RecycleView from './Recycle/view'
import ShareAuditView from './ShareReview/view'
import PreviewView from './Preview/view'
import Mobile from '../../components/Mobile/component.desktop'
import Contact from '../../components/Contact/component.desktop'
import RenderChildren from './RenderChildren/view'
import UserAgreement from './UserAgreement/view'

export default {
    '/': RootView,
    '/index': IndexView,
    '/login': LoginView,
    '/home': HomeView,
    '/home/documents': RenderChildren,
    '/home/documents/all': DocsView,
    '/home/documents/recent': () => <div>{'recent'}</div>,
    '/home/documents/favorites': MyFavoritesView,
    '/home/documents/share': MyShareView,
    '/home/documents/recycle': RecycleView,
    '/home/search': SearchView,
    '/home/approvals': RenderChildren,
    '/home/approvals/share-review': ShareAuditView,
    '/home/approvals/share-application': ShareApplyView,
    '/home/approvals/flow-review': () => <div>流程审核</div>,
    '/home/approvals/flow-application': () => <div>流程申请</div>,
    '/home/user': RenderChildren,
    '/home/user/device': Mobile,
    '/home/user/contact': Contact,
    '/home/message': RenderChildren,
    '/home/message/share': ShareMessages,
    '/home/message/review': CheckMessages,
    '/home/message/security': SecurityMessages,
    '/home/user/info': InfoView,
    '/link': LinkView,
    '/preview': PreviewView,
    '/getfiles': GetFiles,
    '/useragreement': UserAgreement
}