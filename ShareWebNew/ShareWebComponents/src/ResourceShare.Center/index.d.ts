declare namespace Components {
    namespace ShareCenter {
        interface Props extends React.Props<any> {

            /**
             * 点击学段事件
             */
            handleClickPhase(entries: object): void;

            /**
             * 点击课程事件
             */
            handleClickSubject(entries: object): void;

            /**
             * 点击版本事件
             */
            handleClickEdition(entries: object): void;

            /**
             * 点击教材事件
             */
            handleClickBook(entries: object): void;

            /**
             * 获取Token验证
             */
            handleLoadToken(): void;

            /**
             * 获取学段
             */

            handleLoadPhase(): void;

            /**
             * 获取学科(课程)
             */
            handleLoadSubject(): void;

            /**
             * 获取版本
             */
            handleLoadEdition(): void;

            /**
             * 获取教材列表，需要遍历年级和册别后分别获取到
             */
            handleLoadBook(): void;

            /**
            * 获取教材目录
            */
            handleLoadUnit(): void;

            /**
             * 获取资源类型列表
             */
            handleLoadType(): void;

            /**
             * 多选框是否显示
             * （1）单选模式不显示
             * （2）topView，不显示
             *  (3) selectType包括dir，显示
             *  (4) selectType不包括dir，文件夹不显示，文件显示
             */
            checkBoxVisible(node: object): boolean;

            /**
             * 选中时触发获取对应的教材目录及资源类型
             * @param selection 当前选中的教材目录
             */
            handleUnitSelectionChange(selection: object): void;

            /**
             * 选择不同资源类型时触发获取对应的教材目录及资源类型
             * @param selection 当前选中的资源类型
             */
            handleTypeSelectionChange(selection: object): void;
        }

        interface State {
            /**
             * 学段
             */
            phase: Array<object>,

            /**
             * 课程
             */
            subject: Array<object>,

            /**
             * 版本
             */
            edition: Array<object>,

            /**
             * 教材
             */
            book: Array<object>,

            /**
             * 教材目录
             */
            unit: Array<object>,

            /**
             * 资源类型
             */
            type: Array<object>,

            /**
             * 当前选中学段
             */
            currentPhase: object,

            /**
             * 当前选中课程
             */
            currentSubject: object,

            /**
             * 当前选中版本
             */
            currentEdition: object,

            /**
             * 当前选中教材
             */
            currentBook: object,

            /**
             * 当前选中教材目录
             */
            currentUnit: object,

            /**
             * 当前选中资源类型
             */
            currentType: object,

            /**
             * 验证Token
             */
            access_token: string,

            /**
             * 是否处于加载中
             */
            isLoading: boolean,

            /**
             * 教材索引
             */
            currentBookIndex: number;
        }
    }
}