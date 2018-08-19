import {  OnDup } from '../../core/upload/upload'

declare namespace Components {
    namespace Upload {
        interface Props extends React.Props<void> { }

        namespace Exceptions {
            interface Props {

            }

            interface State {
                event: any
                setDefault: boolean
                ondup: OnDup
            }
        }
    }
}