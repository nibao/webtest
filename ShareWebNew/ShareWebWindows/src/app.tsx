import * as React from 'react';
import AppFactory from './appfactory';
import { last } from 'lodash'
import { openDir, previewFile } from '../core/client/client';
import { post } from '../util/http/http';
import About from '../components/About/component.client';
import LinkShare from '../components/LinkShare/component.client';
import Share from '../components/Share/component.client';
import SideBar from '../components/SideBar/component.client';
import GroupManage from '../components/GroupManage/component.client';
import Recycle from '../components/Recycle/component.client';
import Messages from '../components/Message2/component.client';
import SyncDetails from '../components/SyncDetails/component.client';
import ViewSize from '../components/ViewSize/component.client';
import AddTag from '../components/TagAdder/component.client';
import EditTag from '../components/TagEditor/component.client';
import RestoreRevision from '../components/RestoreRevision/component.client';
import CSFEditor from '../components/CSFEditor/component.client';
import CacheDirectory from '../components/CacheDirectory/component.client';
import CleanCache from '../components/CleanCache/component.client';
import Preview from '../components/Preview2/component.client';
import FullSearch from '../components/FullSearch/component.client';
import MyFavorites from '../components/MyFavorites/component.client';
import { ClientComponentContext } from '../components/helper';
import { openUrlByChrome } from '../core/apis/client/tmp/tmp';
import { buildWebClientURI } from '../core/config/config';
import { getOpenAPIConfig } from '../core/openapi/openapi';
import { Status } from './constants';



/**
 * ============= 注册组件 =============
 */
AppFactory.register('syncdetails', ({ props, id, fields, unmountComponent, updateApp }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <SyncDetails
            {...props}
            id={id}
            fields={fields}
            onSkipDirectTransferTipChange={(skipDirectTransferTip) => updateApp((state, setAppState) => {
                setAppState({
                    config: { skipDirectTransferTip }
                })
            }

            )}
            onCloseDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>


));


AppFactory.register('sidebar', ({ props, id, fields, unmountComponent, updateApp }) => (

    <SideBar
        {...props}
        id={id}
        fields={fields}
        onCloseSideBar={unmountComponent}
        onFavoriteChange={(docs, favorited) => updateApp((state, setAppState) => setAppState({
            components: Object.entries(state.components).reduce((result, [id, component]) => {
                if ((component.name === 'sidebar' && component.props.docs[0].docid === docs[0].docid) || component.name === 'myfavorites') {
                    return {
                        ...result,
                        [id]: {
                            ...component,
                            props: {
                                ...component.props,
                                docs,
                                favorited,
                            }
                        }
                    }
                }
                else {
                    return {
                        ...result,
                        [id]: component,
                    }
                }
            }, {})
        }))}
    />
));

AppFactory.register('about', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <About
            {...props}
            id={id}
            fields={fields}
            onCloseAboutDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('linkshare', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <LinkShare
            {...props}
            id={id}
            fields={fields}
            onErrorConfirm={unmountComponent}
            doConfigurationClose={unmountComponent}
            onCloseLinkShareDialog={unmountComponent}
            doApprovalCheck={async () => {
                const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

                openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, lang: locale, redirect: '/home/approvals/share-application', platform: 'pc' } }) })
            }}
        />
    </ClientComponentContext.Provider>


));

AppFactory.register('share', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <Share
            {...props}
            id={id}
            fields={fields}
            onCloseDialog={unmountComponent}
            doApvJump={async () => {
                const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

                openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, lang: locale, redirect: '/home/approvals/share-application', platform: 'pc' } }) })
            }}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('groupmanage', ({ props, id, fields, unmountComponent }) => {
    return (
        <ClientComponentContext.Provider
            froozen={props.status !== Status.Online || props.isOnline === false}
        >
            <GroupManage
                {...props}
                id={id}
                fields={fields}
                onClose={unmountComponent}
            />
        </ClientComponentContext.Provider>
    )
});


AppFactory.register('messages', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <Messages
            {...props}
            id={id}
            fields={fields}
            doRedirect={openDir}
            doPreview={previewFile}
            onCloseMessagesDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>

));

AppFactory.register('recycle', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <Recycle
            {...props}
            id={id}
            fields={fields}
            onCloseDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));


AppFactory.register('viewsize', ({ props, id, fields, unmountComponent, updateApp }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <ViewSize
            {...props}
            id={id}
            fields={fields}
            onStatisticsCompleted={docs => updateApp((state, setAppState) => setAppState({
                components: Object.entries(state.components).reduce((result, [id, component]) => {
                    if (component.name === 'sidebar') {
                        return {
                            ...result,
                            [id]: {
                                ...component,
                                props: {
                                    ...component.props,
                                    docs
                                }
                            }
                        }
                    }
                    else {
                        return {
                            ...result,
                            [id]: component,
                        }
                    }
                }, {})
            }))}
            onStaticsConfirm={unmountComponent}
            onStaticsCancel={unmountComponent}
            onCloseDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('addtag', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <AddTag
            {...props}
            id={id}
            fields={fields}
            onCloseDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('edittag', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <EditTag
            {...props}
            id={id}
            fields={fields}
            onCloseDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('restorerev', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <RestoreRevision
            {...props}
            id={id}
            fields={fields}
            onConfirmError={unmountComponent}
            onRevisionRestoreSuccess={unmountComponent}
            onRevisionRestoreCancel={unmountComponent}
            onCloseRestoreRevisionDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('editcsf', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <CSFEditor
            {...props}
            id={id}
            fields={fields}
            onUpdateCsflevel={() => unmountComponent()}
            onCloseDialog={() => unmountComponent()}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('cachedirectory', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <CacheDirectory
            {...props}
            id={id}
            fields={fields}
            onCancelCacheDirectory={unmountComponent}
            onConfirmCacheDirectory={unmountComponent}
            onCloseCacheDirectoryDialog={unmountComponent}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('preview', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <Preview
            {...props}
            id={id}
            fields={fields}
            onClosePreviewDialog={unmountComponent}
            doInnerShareLink={doc => post(`http://127.0.0.1:10080/share/${encodeURIComponent(last(doc.docid.split('/')))}`, { doc: doc }, { sendAs: 'json', readAs: 'json' })}
            doOuterShareLink={doc => post(`http://127.0.0.1:10080/linkshare/${encodeURIComponent(last(doc.docid.split('/')))}`, { doc: doc }, { sendAs: 'json', readAs: 'json' })}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('cleancache', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <CleanCache
            {...props}
            id={id}
            fields={fields}
            onCancelClean={() => unmountComponent()}
            onConfirmClean={() => unmountComponent()}
            onCloseCleanCacheDialog={() => unmountComponent()}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('fullsearch', ({ props, id, fields, unmountComponent }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <FullSearch
            {...props}
            id={id}
            fields={fields}
            onCloseDialog={unmountComponent}
            doFilePreview={previewFile}
            doDirOpen={openDir}
            doApprovalCheck={async () => {
                const { userid, tokenid, locale: lang } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

                openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, lang: locale, redirect: '/home/approvals/share-application', platform: 'pc' } }) })
            }}
        />
    </ClientComponentContext.Provider>
));

AppFactory.register('myfavorites', ({ props, id, fields, unmountComponent, updateApp }) => (
    <ClientComponentContext.Provider
        froozen={props.status !== Status.Online || props.isOnline === false}
    >
        <MyFavorites
            {...props}
            id={id}
            fields={fields}
            doDirOpen={openDir}
            doFilePreview={(e, doc) => { previewFile(doc) }}
            doShare={(doc) => { post(`http://127.0.0.1:10080/share/myfavorites${encodeURIComponent(last(doc.docid.split('/')))}`, { doc: doc }, { sendAs: 'json', readAs: 'json' }) }}
            doLinkShare={(doc) => { post(`http://127.0.0.1:10080/linkshare/myfavorites${encodeURIComponent(last(doc.docid.split('/')))}`, { doc: doc }, { sendAs: 'json', readAs: 'json' }) }}
            onCloseFavoritesDialog={unmountComponent}
            onFavoriteCancel={docs => updateApp((state, setAppState) => setAppState({
                components: Object.entries(state.components).reduce((result, [id, component]) => {
                    if (component.name === 'sidebar' && component.props.docs[0] && component.props.docs[0].docid === docs[0].docid) {
                        return {
                            ...result,
                            [id]: {
                                ...component,
                                props: {
                                    ...component.props,
                                    docs
                                }
                            }
                        }
                    }
                    else {
                        return {
                            ...result,
                            [id]: component,
                        }
                    }
                }, {})
            }))}
        />
    </ClientComponentContext.Provider>
));


export default AppFactory();