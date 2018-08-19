declare namespace UI {
    namespace DialogMain {
        interface Props extends React.Props<void> {
        }

        interface Element extends React.ReactElement<Props> {
        }

        interface StatelessComponent extends React.StatelessComponent<Props> {
            (props: Props): Element;
        }
    }
}