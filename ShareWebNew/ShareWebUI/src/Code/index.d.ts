declare namespace UI {
    namespace Code {
        interface Props extends React.Props<void> {
            /**
             * class
             */
            className?: string;

            /**
             * 语言，如果不传则highlight.js进行猜测
             */
            language?: string;
        }

        interface Element extends React.ReactElement<Props> {
        }
    }
}