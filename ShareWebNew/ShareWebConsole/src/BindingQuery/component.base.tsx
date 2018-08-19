import * as React from 'react'
import session from '../../util/session/session'
import { ShareMgnt, EACP } from '../../core/thrift/thrift'
import WebComponent from '../webcomponent'
import __ from './locale';

export enum SearchField {
    CustomLib,
    ArchiveLib,
    User
}

export const deviceType = {
    0: __('未知设备'),
    1: __('iOS'),
    2: __('Android'),
    3: __('Windows Phone'),
    4: __('Windows'),
    5: __('Mac OS X'),
    6: __('Web')
}

export default class BindingQueryBase extends WebComponent<any, any>{
    state = {
        searchField: SearchField.User,
        netInfos: [],
        deviceInfos: [],
        searchResults: [],
        searchKey: ''
    }

    loaders = {
        [SearchField.ArchiveLib]: this.searchArchiveLibLoader,
        [SearchField.CustomLib]: this.searchCustomLibLoader,
        [SearchField.User]: this.searchUserLoader
    }

    /**
     * 归档库搜索
     */
    searchArchiveLibLoader(key) {
        return key ? EACP('EACP_SearchArchiveDocInfos', [{
            ncTGetPageDocParam: {
                docCreaters: [],
                docNames: [key],
                docOwners: [],
                docTypes: [],
                limit: -1,
                sortKey: 1,
                sortType: 0,
                start: 0,
                userId: session.get('userid')
            }
        }]) : Promise.resolve([])
    }

    /**
     * 文档库搜索
     */
    searchCustomLibLoader(key) {
        return key ? EACP('EACP_SearchCustomDocInfos', [{
            ncTGetPageDocParam: {
                docCreaters: [],
                docNames: [key],
                docOwners: [],
                docTypes: [],
                limit: -1,
                sortKey: 1,
                sortType: 0,
                start: 0,
                userId: session.get('userid')
            }
        }]) : Promise.resolve([])
    }

    /**
     * 用户、组织搜索
     */
    searchUserLoader(key) {
        return key ? Promise.all([
            ShareMgnt('Usrm_SearchDepartments', [key]),
            ShareMgnt('Usrm_SearchSupervisoryUsers', [session.get('userid'), key])
        ]).then(([departs, users]) => [...departs, ...users]) : Promise.resolve([])
    }

    /**
     * 搜索关键字
     */
    handleSearchChange(searchKey) {
        if (searchKey !== this.state.searchKey) {
            this.setState({
                searchKey,
                netInfos: [],
                deviceInfos: [],
            })
        }
    }

    /**
     * 搜索范围 访问者，文档库， 归档库
     */
    handleChangeSearchField(searchField) {
        this.setState({
            searchField,
            netInfos: [],
            deviceInfos: []
        }, () => {
            this.loaders[searchField](this.state.searchKey).then(this.handleSearchLoaded.bind(this))
            this.refs['auto-complete'].toggleActive(true)
        })
    }

    /**
     * 搜索结果
     */
    handleSearchLoaded(searchResults) {
        this.setState({
            searchResults
        })
    }

    /**
     * 查询用户绑定
     */
    queryUser(item) {
        ShareMgnt('Usrm_SearchLoginAccessControlByName', [item.loginName || item.departmentName]).then(({ net, device }) => {
            this.setState({
                netInfos: net,
                deviceInfos: device,
                searchKey: item.displayName || item.departmentName
            }, () => {
                this.refs['auto-complete'].toggleActive(false)
            })
        })
    }

    /**
     * 查询文档库绑定
     */
    queryLib(lib) {
        ShareMgnt('DocLimitm_GetNetByDocId', [lib.docId]).then(netInfos => {
            this.setState({
                netInfos,
                searchKey: lib.name
            }, () => {
                this.refs['auto-complete'].toggleActive(false)
            })
        })
    }

    /**
     * 按下enter
     */
    handleEnter(e, selectIndex: number) {
        if (selectIndex >= 0) {
            switch (this.state.searchField) {
                case SearchField.User: {
                    this.queryUser(this.state.searchResults[selectIndex])
                    break
                }
                case SearchField.ArchiveLib:
                case SearchField.CustomLib:
                    this.queryLib(this.state.searchResults[selectIndex])
                    break
            }
        }
    }
}