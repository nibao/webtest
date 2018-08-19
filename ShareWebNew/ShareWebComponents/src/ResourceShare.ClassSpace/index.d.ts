declare namespace Components {
    namespace ShareClassSpace {
        interface Props extends React.Props<any> {
            onClassChange(selected: number, data: object): void;
        }
        interface State {
            noClass: boolean; // 用户下是否有班级
            key: string; // 用户验证返回
            cyuid: string; // 用户cyuid
            activeIndex: string; // 当前选中索引
            classList: ReadonlyArray<object>; //班级信息
        }
    }
}