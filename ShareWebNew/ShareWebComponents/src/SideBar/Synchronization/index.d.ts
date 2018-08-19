declare namespace Components {
    namespace Synchronization {
        interface Props extends React.Props<any> {
            sync: {
                mode: number,

                num: number,
            },
            status: number
        }
    }
}