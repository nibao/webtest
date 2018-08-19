import * as React from 'react';
import { noop } from 'lodash';
import { Message, broadcastMessage } from '../../core/client/client'

// 异常
export enum Exception {
    NAME_DUPLICATION_SAME_TYPE = 1, // 同类型的同名冲突
    NAME_DUPLICATION_DIFF_TYPE,     // 不同类型的同名冲突    
    MISSING_SOURCE,                 // 源文件不存在
    NO_PERMISSION_SOURCE,           // 对源文件没有权限
    MISSING_DESTINATION,            // 目标文件不存在
    NO_PERMISSION_DESTINATION,      // 对目标文件没有权限
    NO_SPACE_DESTINATION,           // 目标文件夹没有足够的配额空间
    TAGS_REACH_UPPER_LIMIT,         // 标签个数达到上限
    LACK_OF_CSF,                    // 密级不足
    COPY_OR_MOVE_TO_SELF,           // 复制或移动到自身或其的子文件夹
    SAME_NAME_NO_PERMISSION,        // 对同名文件没有修改权限
    LOCKED,                         // 文件已被锁定（目标路径的同名文件被锁定，无法覆盖）
    SOURCE_DESTINATION_SAME,        // 目标位置和起始位置相同
    MOVE_FILE_OUTBOX,               // 移动文件发送箱
    MISS_LINK,                      // 外链不存在
    COPY_TO_WATERMARK_LIBRARY,      // 无法将文件/文件夹复制到水印文档库
    MOVE_TO_WATERMARK_LIBRARY,      // 无法将文件/文件夹移动到水印文档库
    USER_FREEZED,                   // 用户已被冻结 
    DOC_FREEZED,                    // 文档已被冻结
    SOURCE_DOC_LOCKED,               // 源文件被锁定
    WATERMARK_SAVE_DENIED                // 外链水印文件禁止转存
}

/**
 * icon的类型
 */
export enum IconType {
    None,
    Message,    // 信息提示窗口MessageDialog
    Confirm,    // 警告提示窗口ConfirmDialog,
    Error,      // 错误提示窗口ErrorDialog,
}

// 策略类型
export enum Strategy {
    QUERY = 1,     // 询问
    RENAME,        // 重命名
    OVERWRITE,     // 覆盖
    SKIP,          // 跳过
    ABORT,         // 取消
}

// 异常处理策略
// 例如：遇到同名冲突自动执行覆盖
// eg: strategies = { Exception.NAME_DUPLICATION: Strategy.OVERWRITE } 
interface Strategies {
    // 针对特定异常的处理策略
    [exception: number]: Strategy
}

interface Handler {
    warningHeader?: string;
    warningContent?: string;
    warningFooter?: string;
    showCancelBtn?: boolean;    // 是否显示“取消”按钮
    options?: Array<{           // 可选项
        value: Strategy;
        display: string;
    }>;
    name?: Exception;
    implement?: (strategies) => void;   // 可选项对应的操作
    selected?: Strategy;                // 默认选中了哪个可选项
    iconType?: IconType;            // 提示窗的类型
}

interface Props {
    strategies: Strategies

    // 策略选项
    handlers: {
        // 针对什么异常
        [exception: number]: {
            // 针对什么策略如何具体执行
            [strategy: number]: ((item: any, queue?: Array<any>) => Handler) | Handler;
        }
    }

    exception: Exception;

    /**
     * 点击“确定”按钮，
     * @param reAct 进行可选项中的操作，reAct为true; 没有可选项，reAct为false
     */
    onConfirm(strategies: Strategies, reAct: boolean): void;    // 点击确定

    doc: Core.Docs.Doc;    // 当前正在处理的文件

    onCancel: () => void;   // 取消

    onResize?: () => any;   // 对话框尺寸发生变化时触发
}

interface State {
    handler: Handler;
    selected: Strategy;        // 当有可选项时，选中的可选项
    defaultSeleted: boolean;   // 是否选中“为以后相同的冲突执行此操作”
}

export default class ExceptionStrategyBase extends React.Component<Props, any> {
    state: State = {
        handler: null,
        selected: null,
        defaultSeleted: false,
    }

    static defaultProps: Props = {
        strategies: null,
        handlers: null,
        exception: null,
        onConfirm: noop,
        doc: null,
        onCancel: noop,
    }

    componentWillMount() {
        const { exception, handlers, strategies } = this.props;

        if (strategies[exception]) {
            switch (strategies[exception]) {
                case Strategy.QUERY: {
                    const temHandler = handlers[exception][strategies[exception]]

                    if (temHandler instanceof Function) {
                        const handler: Handler = temHandler(this.props.doc)

                        this.setState({
                            handler,
                            selected: handler.selected
                        })
                    } else {
                        this.setState({
                            handler: temHandler,
                            selected: temHandler.selected
                        })
                    }
                    break;
                }

                default:
                    break;
            }
        }
    }

    /**
     * '跳过之后所有的相同冲突提示'选中状态变化
     */
    toggleChecked(checked: boolean): void {
        this.setState({
            defaultSeleted: checked
        })
    }

    /**
     * 点击“确定”按钮
     */
    confrim(platform?: string) {
        const { selected, defaultSeleted, handler } = this.state;
        const { exception, doc, handlers } = this.props;
        const { options } = handler;

        if (options) {
            // 如果有可选项，就用当前的strategies执行可选项对应的implement()
            handlers[exception][selected](doc).implement({ ...this.props.strategies, [exception]: selected })
        }

        // 如果勾选了“为以后相同的冲突执行此操作”，需要更新strategies，并传出去
        const strategies = defaultSeleted ? { ...this.props.strategies, [exception]: options ? selected : Strategy.SKIP } : this.props.strategies

        if (platform === 'client') {
            broadcastMessage(Message.ExceptionStrategy, { strategies, options: options ? true : false })
        }

        this.props.onConfirm(strategies, options ? true : false)

    }
} 