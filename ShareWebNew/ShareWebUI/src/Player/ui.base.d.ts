declare namespace UI {
    namespace Player {
        interface Props {
            src: string;
        }

        interface State {

        }

        interface Base {
            props: Props;

            state: State;

            player: any;

            refs: {
                video: any;
            }
        }
    }
}