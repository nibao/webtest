declare namespace UI {
    namespace SelectMenu {
        interface Props extends UI.PopMenu.Props {
            value?: any
            
            onChange?: (value: any) => any
        }
    }
}