declare namespace Components {
    namespace PDFViewer {
        namespace Toolbar {
            namespace NumberBox {
                interface Props extends React.Props<any> {
                    /**
                     * 当前所在页,默认为1
                     */
                    current: number;

                    /**
                     * 总页数,默认为1
                     */
                    total: number;

                    /**
                     * 回车事件
                     */
                    onEnter: (pageNumber: number) => any;

                    className: string;
                }

                interface State {
                    /**
                     * 是否聚焦，默认false
                     */
                    onFocus: boolean;

                    /**
                     * 输入框value值
                     */
                    value: number | string;
                }
            }
        }
    }
}