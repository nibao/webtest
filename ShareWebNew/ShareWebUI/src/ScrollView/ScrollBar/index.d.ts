declare namespace UI {
    namespace ScrollView {
        namespace ScrollBar {
            interface Props extends React.Props<any> {
                /**
                 * 容器外层样式
                 */
                className: string;

                /**
                 * 拖动滚动条拖拽回调
                 */
                onDrag: (e: MouseEvent) => void;

                /**
                 * 滚动条滑块大小
                 */
                length: number;

                /**
                 * 滑块滑动距离
                 */
                offsetValue: number;

                /**
                 * 横向or纵向
                 */
                axis?: 'x' | 'y';
            }

            interface State {
            }
        }
    }
}