declare namespace UI {
    namespace ClipboardButton {
        interface Props extends React.Props<any> {
            /**
             * class
             */
            className?: string;

            /**
             * ZeroClipboard.swf路径
             */
            swf?: string;

            /**
             * 要复制的文本
             */
            text: string;

            /**
             * 实现剪贴板操作
             * @param text 文本内容 
             * @return 返回是否成功
             */
            doCopy?: (text: string) => boolean;

            /**
             * 复制成功后执行
             * @param text 文本内容 
             */
            afterCopy?: (text: string) => any;
        }

        interface Component extends React.Component<Props, void> {
        }
    }
}