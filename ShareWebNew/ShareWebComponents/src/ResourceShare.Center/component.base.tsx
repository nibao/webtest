import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { getToken, phaseList, subjectList, editionList, gradeList, volumeList, bookList, unitList, typeList } from '../../core/apis/thirdparty/resourceshare/resourceshare';
import { isDir } from '../../core/docs/docs';
import { DocType, isTopView } from '../../core/entrydoc/entrydoc';
import { SelectUnitType, SelectTargetType } from '../ResourceShare/help';

let cache = {};

export default class ShareCenterBase extends WebComponent<Components.ShareCenter.Props, Components.ShareCenter.State> {
    static defaultProps = {
        /**
         * 选中事件
         */
        onSelectionChange: noop,

        /**
         * 文件和文件夹的选择控制
         */
        selectType: [SelectUnitType.DIR, SelectUnitType.FILE],

        /**
         * 个人文档，共享文档，群组文档，文档库，归档库的选择控制
         */
        selectRange: [DocType.userdoc, DocType.sharedoc, DocType.groupdoc, DocType.customdoc, DocType.archivedoc],

        /**
         * 选择模式: 'single'--单选, 'multi'--多选, 'cascade'--级联
         */
        selectMode: 'single'
    }

    state = {
        phase: [],
        subject: [],
        edition: [],
        book: [],
        unit: [],
        type: [],

        currentPhase: {},
        currentSubject: {},
        currentEdition: {},
        currentBook: {},
        currentUnit: {},
        currentType: {},

        access_token: '',

        isLoading: true,

        currentBookIndex: 0
    }

    componentWillMount() {
        // 第一次进入时全部加载，默认第一个参数为当前值
        this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, null);
        (async () => {
            let access_token = await this.handleLoadToken();
            let type = await this.handleLoadType(access_token);
            let phase = await this.handleLoadPhase(access_token);
            let subject = await this.handleLoadSubject(phase[0], access_token);
            let edition = await this.handleLoadEdition(phase[0], subject[0], access_token);
            let book = await this.handleLoadBook(phase[0], subject[0], edition[0], access_token);
            let unit = await this.handleLoadUnit(phase[0], subject[0], edition[0], book[0], access_token);

            // 渲染数据
            this.setState({
                phase,
                subject,
                edition,
                book,
                unit,
                type,

                currentPhase: phase[0],
                currentSubject: subject[0],
                currentEdition: edition[0],
                currentBook: book[0],
                currentUnit: unit[0],
                currentType: type[0],
                currentBookIndex: 0,

                access_token: access_token,
            }, async () => {
                // 初次加载后向父组件传数据
                this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER,
                    {
                        access_token: access_token,
                        book: book[0]['bookCode'],
                        unit1: unit[0],
                        grade: book[0]['grade'],
                        volume: book[0]['volume'],
                        subject: subject[0],
                        phase: phase[0],
                        edition: edition[0],
                        type: type[0],
                        bookIndex: this.state.currentBookIndex
                    });

                // 保证数据加载完毕
                await new Promise((resolve) => this.setState({ isLoading: false }, resolve));
            });

        })();

    }

    /**
     * 点击学段事件
     * @param entries 学段
     */
    protected async handleClickPhase(entries) {
        // 点击不同学段，分别加载以学段为参数的所有请求函数
        this.setState({
            currentPhase: entries,
            subject: [],
            edition: [],
            book: [],
            unit: [],
            isLoading: true,
        }, async () => {

            this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, null);

            let { access_token } = this.state;
            let subject = await this.handleLoadSubject(entries, access_token);
            let edition = await this.handleLoadEdition(entries, subject[0], access_token);
            let book = await this.handleLoadBook(entries, subject[0], edition[0], access_token);
            let unit = await this.handleLoadUnit(entries, subject[0], edition[0], book[0], access_token);

            // 渲染数据
            this.setState({
                subject,
                edition,
                book,
                unit,

                currentSubject: subject[0],
                currentEdition: edition[0],
                currentBook: book[0],
                currentUnit: unit[0],

            }, async () => {
                this.handleUnitSelectionChange(unit[0]);
                // 保证数据加载完毕
                await new Promise((resolve) => this.setState({ isLoading: false }, resolve));
            });
        });


    }

    /**
     * 点击课程事件
     * @param entries 课程
     */
    protected async handleClickSubject(entries) {
        // 点击不同课程，首先清空所有依赖项，然后分别加载以课程为参数的所有请求函数,
        this.setState({
            currentSubject: entries,
            edition: [],
            book: [],
            unit: [],
            isLoading: true,
        }, async () => {
            this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, null);
            let { currentPhase, access_token } = this.state;
            let edition = await this.handleLoadEdition(currentPhase, entries, access_token);
            let book = await this.handleLoadBook(currentPhase, entries, edition[0], access_token);
            let unit = await this.handleLoadUnit(currentPhase, entries, edition[0], book[0], access_token);

            // 渲染数据
            this.setState({
                edition,
                book,
                unit,

                currentEdition: edition[0],
                currentBook: book[0],
                currentUnit: unit[0],

            }, async () => {
                this.handleUnitSelectionChange(unit[0]);
                // 保证数据加载完毕
                await new Promise((resolve) => this.setState({ isLoading: false }, resolve));
            });
        });

    }

    /**
     * 点击版本事件
     * @param entries 版本
     */
    protected async handleClickEdition(entries) {
        // 点击不同版本，分别加载以版本为参数的所有请求函数
        this.setState({
            currentEdition: entries,
            book: [],
            unit: [],
            isLoading: true,
        }, async () => {
            this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, null);
            let { currentPhase, currentSubject, access_token } = this.state;
            let book = await this.handleLoadBook(currentPhase, currentSubject, entries, access_token);
            let unit = await this.handleLoadUnit(currentPhase, currentSubject, entries, book[0], access_token);

            // 渲染数据
            this.setState({
                book,
                unit,

                currentBook: book[0],
                currentUnit: unit[0],

            }, async () => {
                this.handleUnitSelectionChange(unit[0]);
                // 保证数据加载完毕
                await new Promise((resolve) => this.setState({ isLoading: false }, resolve));
            });

        });

    }

    /**
     * 点击教材事件
     * @param entries 教材
     */
    protected async handleClickBook(entries, index) {
        // 点击不同教材，请求教材目录
        this.setState({
            currentBook: entries,
            unit: [],
            isLoading: true,
            currentBookIndex: index
        }, async () => {

            this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, null);
            let { currentPhase, currentSubject, currentEdition, access_token } = this.state;
            let unit = await this.handleLoadUnit(currentPhase, currentSubject, currentEdition, entries, access_token);

            // 渲染数据
            this.setState({
                unit,

                currentUnit: unit[0],

            }, async () => {
                this.handleUnitSelectionChange(unit[0]);
                // 保证数据加载完毕
                await new Promise((resolve) => this.setState({ isLoading: false }, resolve));
            });

        });
    }


    /**
     * 获取token
     */
    private async handleLoadToken() {
        let req = await getToken();
        let { access_token } = JSON.parse(req['response']);

        return access_token;
    }

    /**
     * 获取学段
     */
    protected async handleLoadPhase(access_token) {

        if (!cache['00']) {
            let req = await phaseList({ access_token });
            let { data: { data: phaseData } } = JSON.parse(req['response']);
            cache['00'] = phaseData;
        }

        let phase = cache['00'];

        return phase;

    }

    /**
     * 获取学科(课程)
     */
    protected async handleLoadSubject(currentPhase, access_token) {

        let key = ['00', currentPhase['code']].join('.');
        if (!cache[key]) {
            let req = await subjectList({ access_token, phase: currentPhase['code'] });
            let { data: { data: subjectData } } = JSON.parse(req['response']);
            cache[key] = subjectData;
        }

        let subject = cache[key];

        return subject;
    }

    /**
     * 获取版本
     */
    protected async handleLoadEdition(currentPhase, currentSubject, access_token) {

        let key = ['00', currentPhase['code'], currentSubject['code']].join('.');
        if (!cache[key]) {
            let req = await editionList({ access_token, phase: currentPhase['code'], subject: currentSubject['code'] });
            let { data: { data: editionData } } = JSON.parse(req['response']);
            cache[key] = editionData;
        }
        let edition = cache[key];

        return edition;
    }

    /**
     * 获取教材列表，需要遍历年级和册别后分别获取到
     */
    protected async handleLoadBook(currentPhase, currentSubject, currentEdition, access_token) {

        let key = ['00', currentPhase['code'], currentSubject['code'], currentEdition['code']].join('.');
        if (!cache[key]) {
            let req = await gradeList({ access_token, phase: currentPhase['code'] });
            let { data: { data: gradesData } } = JSON.parse(req['response']);
            cache[key] = gradesData;
        }

        let grades = cache[key];

        let newBook = [];
        // 获取到的年级是一个对象数组，遍历这个数组，根据每一个年级，获取册别
        if (!grades) {
            return;
        }
        for (let grade of grades) {

            let key = ['00', currentPhase['code'], currentSubject['code'], currentEdition['code'], grade['code']].join('.');
            if (!cache[key]) {
                let req = await volumeList({
                    access_token, phase: currentPhase['code'], edition: currentEdition['code'], grade: grade['code'], subject: currentSubject['code']
                });
                let { data: { data: volumesData } } = JSON.parse(req['response']);
                cache[key] = volumesData;
            }

            let volumes = cache[key];
            if (!volumes) {
                continue;
            }
            // 获取到的册别是一个对象数组，遍历这个数组，根据每一个年级下的每一个册别，构成book对象book: {grade, volume, bookCode }放入state
            for (let volume of volumes) {

                let key = ['00', currentPhase['code'], currentSubject['code'], currentEdition['code'], grade['code'], volume['code']].join('.');
                if (!cache[key]) {
                    let req = await bookList({
                        access_token, phase: currentPhase['code'], subject: currentSubject['code'], edition: currentEdition['code'], grade: grade['code'], volume: volume['code']
                    });
                    let { data: { data: bookCodeData } } = JSON.parse(req['response']);
                    cache[key] = bookCodeData;
                }

                let bookCode = cache[key];

                let newBookItem = {
                    grade: grade,
                    volume: volume,
                    bookCode: bookCode
                }
                newBook = newBook.concat(newBookItem);

            }
        }

        return newBook;


    }

    /**
    * 获取教材目录
    */
    protected async handleLoadUnit(currentPhase, currentSubject, currentEdition, currentBook, access_token, ) {

        let key = ['00', currentPhase['code'], currentSubject['code'], currentEdition['code'], currentBook['grade']['code'], currentBook['volume']['code'], currentBook['bookCode'][this.state.currentBookIndex]['code']].join('.');
        if (!cache[key]) {
            let req = await unitList({ access_token, bookCode: currentBook['bookCode'][this.state.currentBookIndex]['code'] });
            let { data: { data: unitData } } = JSON.parse(req['response']);
            cache[key] = unitData;
        }

        let unit = cache[key];

        return unit;

    }

    /**
     * 获取资源类型列表
     */
    protected async handleLoadType(access_token) {

        let req = await typeList({ access_token });
        let { data: type } = JSON.parse(req['response']);

        return type;
    }

    /**
     * 多选框是否显示
     * （1）单选模式不显示
     * （2）topView，不显示
     *  (3) selectType包括dir，显示
     *  (4) selectType不包括dir，文件夹不显示，文件显示
     */
    checkBoxVisible(node) {
        if (this.props.selectMode === 'single') {
            return false
        }
        if (isTopView(node.data)) {
            return false
        }
        if (this.props.selectType.includes(SelectUnitType.DIR)) {
            return true
        }
        return !isDir(node.data)
    }


    /**
     * 选中时触发获取对应的教材目录及资源类型
     * @param selection 当前选中的教材目录
     */
    protected handleUnitSelectionChange(selection) {
        let { currentBookIndex, currentBook, access_token, currentPhase, currentSubject, currentEdition, currentType } = this.state;

        let unitNodes = [selection];
        let tmpSelect = selection;
        while (tmpSelect['parent']) {
            unitNodes.unshift(tmpSelect['parent']);
            tmpSelect = tmpSelect['parent'];
        }

        let unitParams = {
            access_token: access_token,
            book: currentBook['bookCode'],
            grade: currentBook['grade'],
            volume: currentBook['volume'],
            subject: currentSubject,
            phase: currentPhase,
            edition: currentEdition,
            type: currentType,
            bookIndex: currentBookIndex
        }
        for (let i = 0; i < unitNodes.length; i++) {
            unitParams['unit' + (i + 1)] = unitNodes[i];
        }

        this.setState({
            currentUnit: selection
        }, () => {
            // 每次选中教材目录后，都向父组件传数据
            this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, unitParams);
        });
    }

    /**
     * 选择不同资源类型时触发获取对应的教材目录及资源类型
     * @param selection 当前选中的资源类型
     */
    protected handleTypeSelectionChange(selection) {
        let { currentBookIndex,currentBook, access_token, currentPhase, currentSubject, currentEdition, currentUnit } = this.state;

        let unitNodes = [currentUnit];
        let tmpSelect = currentUnit;
        while (tmpSelect['parent']) {
            unitNodes.unshift(tmpSelect['parent']);
            tmpSelect = tmpSelect['parent'];
        }

        let unitParams = {
            access_token: access_token,
            book: currentBook['bookCode'],
            grade: currentBook['grade'],
            volume: currentBook['volume'],
            subject: currentSubject,
            phase: currentPhase,
            edition: currentEdition,
            type: selection,
            bookIndex: currentBookIndex
        }
        for (let i = 0; i < unitNodes.length; i++) {
            unitParams['unit' + (i + 1)] = unitNodes[i];
        }

        this.setState({
            currentType: selection.value
        }, () => {
            // 每次选中资源类型后，都向父组件传数据
            this.props.onUnitChange(SelectTargetType.SHARE_TO_RESOUCRE_CENTER, unitParams);
        });
    }



}
