declare namespace Console {
    namespace ClientUpgrade {
        namespace Progress {
            interface Props extends React.Props<any> {
                /**
                 * 进度值
                 */
                progressValue: number;
            }
        }
    }
}