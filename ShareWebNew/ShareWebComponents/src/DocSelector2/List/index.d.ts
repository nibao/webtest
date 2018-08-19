declare namespace Components {
    namespace DocSelector2 {
        namespace List {
            interface Props extends React.Props<any> {
                /**
                 * 列举结果
                 */
                list: {
                    /**
                     * 列举结果的文件夹
                     */
                    dirs: Core.Docs.Docs;

                    /**
                     * 列举结果的文件
                     */
                    files: Core.Docs.Docs;
                };

                /**
                 * 内容为空组件
                 */
                EmptyComponent?: React.ReactNode | React.StatelessComponent<void>;

                /**
                 * 打开文件夹
                 */
                onRequestOpenDir: (doc: Core.Docs.Doc) => void;
            }
        }
    }
}