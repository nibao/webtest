declare namespace Console {
    namespace EnableDisk {
        namespace DiskUserTree {
            interface Props extends React.Props<any> {
                /**
                 * 选中事件
                 */
                onSelectionChange: () => any;
            }
            
            interface State {
                /**
                 * 树节点
                 */
                nodes: ReadonlyArray<any>;
            }
        }
    }
}