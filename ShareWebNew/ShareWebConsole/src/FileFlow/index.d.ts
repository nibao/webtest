import { NodeType } from '../OrganizationTree/helper';

declare namespace Console {
    namespace FileFlow {
        interface Props extends React.Props<void> {
            /**
             * 创建流程取消事件
             */
            cancelSetFlow: () => void

            /**
             * 创建流程完成事件
             */
            onCreateFlowSuccess: (params: object) => void

            /**
             * 编辑流程完成事件
             */
            onEditFlowSuccess: (params: object) => void

            /**
             *  管理员id
             */
            userid: string

            /**
             * 管理员name
             */
            username: string

            /**
             * 可选范围
             */
            selectType?: Array<NodeType>;

            /**
             * 从 angular 中拿到的流程数据
             */
            process: Object
        }

        interface State {
            /**
             * 弹窗状态
             * 包括 流程弹窗状态  错误弹窗状态  信息提示弹窗状态
             */
            dialogStatus: number

            /**
             * 后端接口报错提示信息
             */
            errMsg: string

            /**
             * 创建流程定义流程中流程名称
             */
            flowName: string

            /**
             * 创建流程定义流程中流程名称合法状态
             */
            flowNameValidateStatus: number

            /**
             * 创建流程定义流程中文档最终保存位置
             */
            fileLocation: Array<object>

            /**
             * 根据用户选择的 gns 获取路径
             */
            fileLocationFormGns: string

            /**
             * 文档组织树的弹窗状态
             */
            isPickingDest: boolean

            /**
             * 创建流程中审核模式
             */
            auditModel: string

            /**
             * 用审核员关键字查找到的审核员
             */
            accessorSearchResult: Array<object>

            /**
             * 审核员列表(有审核员身份)
             */
            allAccessorInfos: Array<object>

            /**
             * 已经被用户选择的审核员信息
             */
            selectedAccessorInfos: Array<object>

            /**
             * 查找适用范围关键字
             */
            findApplicativeRangeKey: string

            /**
             * 已经被用户选择的适用范围
             */
            applicativeRangeResult: Array<object>

            /**
             * 可以被用户选择的适用范围列表
             */
            applicativeRangeList: Array<string>

            /**
             * 根据管理员id获取所有文档流程信息, admin获取所有
             */
            allProcessInfo: Array<object>

            /**
             * 文档最终保存位置状态
             */
            fileLocationStatus: number

            /**
             * 用户选择的适用范围状态
             */
            applicativeRangeResultStatus: number
        }
    }
}
