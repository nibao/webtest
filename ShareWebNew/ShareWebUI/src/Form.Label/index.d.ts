declare namespace UI {
    namespace FormLabel {
        interface Props extends React.Props<void> {
            /**
             * 对齐方式
             */
            align?: string;
        }

        interface Element extends React.ReactElement<Props> {
        }

        interface Component extends React.StatelessComponent<Props> {
            (props: Props): Element;
        }
    }
}