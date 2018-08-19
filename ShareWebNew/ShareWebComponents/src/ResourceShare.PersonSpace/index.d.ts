declare namespace Components {
    namespace SharePersonSpace {
        interface Props extends React.Props<any> {
            onSourceTypeChange(selected: number, data: object): void;
        }
        interface State {
            unknownRole: boolean; // 用户角色不为老师或者教研员
            roleName: string; // 用户角色，比如teacher
            roleName_zh_cn: string, //用户角色的中文名,比如“老师”
            key: string; // 用户验证返回key
            activeIndex: string; // 当前选中标识
        }
    }
}