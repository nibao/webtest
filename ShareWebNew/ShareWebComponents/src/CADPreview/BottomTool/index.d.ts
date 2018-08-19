declare namespace Components {
    namespace CADPreview {
        namespace BottomTool {
            interface Props extends React.Props<any> {
                /**
                 * 图标
                 */
                icons: ReadonlyArray<{
                    /**
                     * icon的code
                     */
                    code: string;

                    /**
                     * icon的title
                     */
                    title: string;

                    /**
                     * icon的onClick事件
                     */
                    onClick: () => any;
                }>;

                /**
                 * 背景颜色, 黑色 or 白色
                 */
                theme: 'dark' | 'light';

                /**
                 * BottomTool的mouseMove事件
                 */
                onMouseMoveBottomTool: () => any;
            }
        }
    }
}