declare namespace UI {
    namespace FormField {
        interface Props extends React.Props<void> {
        }

        interface Element extends React.ReactElement<Props> {
        }

        interface Component extends React.StatelessComponent<Props> {
            (props: Props): Element
        }
    }
}