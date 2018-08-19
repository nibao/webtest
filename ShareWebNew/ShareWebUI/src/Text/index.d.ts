declare namespace UI {
    namespace Text {
        interface Props extends React.Props<void> {
            /**
             * 是否允许用户选中文本
             * @default true
             */
            selectable?: boolean;

            className?: string;

            /** 
             * 文本省略模式（末尾省略或中间省略），默认超出末尾部分显示... 
             * @default 'tail'
             */
            ellipsizeMode?: 'tail' | 'middle';

            /** 
             * 截断文本的最大字符长度
             * @default 70
             */
            numberOfChars?: number;
        }

        interface Element extends React.ReactElement<Props> {

        }
    }
}