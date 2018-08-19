declare namespace UI {
    namespace Panel {
        interface Props extends React.Props<void> {
        }

        interface State {
        }

        interface Component extends React.StatelessComponent<Props> {
            Main: UI.PanelMain.Component;
            Footer: UI.PanelFooter.Component;
            Button: UI.PanelButton.Component;
        }
    }
}