declare namespace Console {
    namespace NodeManagementDevice {
        namespace Disk {
            interface Props extends React.Props<any> {
                /**
                * 磁盘设备
                */
                diskDevices?: ReadonlyArray<object>;
            }
        }
    }
}
