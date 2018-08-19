import * as React from 'react';
import * as _ from 'lodash';
import WebComponent from '../../webcomponent';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { getGroups, getPersons, deletePersons } from '../../../core/apis/eachttp/contact/contact';


export default class ContactManagerBase extends WebComponent<Components.ContactManager.Props, Components.ContactManager.State> {
    static defaultProps = {

    }

    state = {
        groupSelection: [],
        personSelection: [],
        isLoading: true,
        lazyLoad: true,
        groups: [],
        persons: []
    }

    limit = 30; // 一次性加载条目数

    start = 0;  // 起始加载条目

    locatedIndex = -1; // 定位索引

    listDom = null;     // 列表实例

    static contextTypes = {
        toast: React.PropTypes.func
    }

    componentWillMount() {
        this.loadContactsData();
    }

    /**
     * 整合 Loading & 请求分组 & 联系人数据
     */
    loadContactsData(groupid?) {

        this.setState({
            isLoading: true
        }, async () => {


            // 获取所有groups
            let { groups } = await getGroups();

            // 若没有groupId，则取groups中第一个对象的groupId
            if (!groupid) {
                groupid = groups[0].id
            }

            // 根据groupId查询对应的persons
            let { userinfos: persons } = await getPersons({ groupid: groupid, start: 0, limit: this.limit })

            this.setState({
                groups,
                persons,
                groupSelection: groups.filter((group) => { return group.id === groupid }),
            }, () => {
                this.props.onGroupSelectionChange(this.state.groupSelection)
                this.setState({
                    isLoading: false
                })
            })

        })

    }

    /**
     * 请求联系人数据
     */
    async loadPersonsData(groupid?, start = 0) {
        if (start === 0) {
            this.start = 0;
            // 清空原有数据
            this.setState({
                persons: []
            })
        }
        let { groups } = this.state;
        if (!groupid) {
            groupid = groups[0].id
        }
        let { userinfos: persons } = await getPersons({ groupid: groupid, start, limit: this.limit })

        return persons;

    }

    /**
     * 分组选中项变更
     */
    protected handleGroupSelectionChange(groupSelection) {
        if (groupSelection.length && groupSelection[0] && !_.isEqual(groupSelection, this.state.groupSelection)) {
            this.setState({
                groupSelection,
                isLoading: true,
                lazyLoad: false,
            }, async () => {
                this.listDom.resetState();

                // 分组变更时，请求对应的联系人数据
                let persons = await this.loadPersonsData(groupSelection[0].id)
                this.setState({
                    persons
                }, () => {
                    this.props.onGroupSelectionChange(groupSelection)
                    this.setState({
                        isLoading: false,
                        lazyLoad: true
                    })
                })

            })
        }




    }

    /**
     * 联系人选中项变更
     */
    protected handlePersonSelectionChange(personSelection) {
        this.setState({
            personSelection
        })
    }

    /**
     * 删除联系人项
     */
    protected handleDeleteContactPerson(personSelection) {
        try {
            this.setState({
                isLoading: true
            }, async () => {
                await deletePersons({ groupid: this.state.groupSelection[0].id, userids: [personSelection.userid] })
                this.loadContactsData(this.state.groupSelection[0].id)
            })

        } catch (error) {
            this.context.toast(getErrorMessage(error))
            this.loadContactsData(this.state.groupSelection[0].id)
        }

    }

    /**
     * 点击搜索结果
     */
    protected handleSelectSearchResult(res) {

        this.setState({
            isLoading: true
        }, async () => {
            let { groupid, userid } = res;
            let { groups } = await getGroups();
            let persons = await this.loadPersonsData(groupid);

            // 由于通过懒加载的方式加载到联系人列表不完全，因此需要完全加载联系人列表直到找到该联系人所在位置，通过scrollTo定位到该位置。
            let foundIndex = _.findIndex(persons, (person) => { return person.userid === userid });
            while (foundIndex === -1) {
                this.start += this.limit;
                let nextPersons = await this.loadPersonsData(groupid, this.start);
                if (nextPersons.length === 0) {
                    // 如果加载到最后，则直接跳出循环
                    break;
                }
                persons = [...persons, ...nextPersons];
                foundIndex = _.findIndex(persons, (person) => { return person.userid === userid });
            }

            this.locatedIndex = foundIndex;
            this.listDom.resetState();
            this.setState({
                persons,
                groups,
                personSelection: persons.filter((person) => { return person.userid === userid }),
                groupSelection: groups.filter((group) => { return group.id === groupid })
            }, () => {
                this.setState({
                    isLoading: false
                })

            })
        })

    }

    /**
     * 联系人列表懒加载
     */
    protected handleLazyLoadList(page, limit) {
        this.setState({
            isLoading: true
        }, async () => {
            this.start += this.limit;
            this.locatedIndex = -1;
            let persons = await this.loadPersonsData(this.state.groupSelection[0].id, this.start)
            this.setState({
                persons: [...this.state.persons, ...persons],
                isLoading: false
            })

        })
    }



    /**
     * 设置默认列表选项
     */
    protected handleGroupDefaultSelection() {
        return this.state.groupSelection[0]
    }

    /**
     * 设置默认列表选项
     */
    protected handleListDefaultSelection() {
        return this.state.personSelection[0]
    }

    /**
     * 获取列表实例
     */
    protected handleGetList(ref) {
        ref ? this.listDom = ref : null
    }

    /**
     * 设置列表选中项位置
     */
    protected handleSetLocation() {
        return this.locatedIndex
    }

    /**
     * 设置列表Key
     */
    protected handleSetListKey(data) {
        return data.userid
    }

}