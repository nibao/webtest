declare namespace Components {
    namespace Mobile {
        interface Props {

        }

        interface State {
            /**
             * 正在加载中
             */
            isLoading: boolean;

            /**
             * 移动设备数据
             */
            devicesList: Core.APIs.EACHTTP.Device.List;

            /** 
             * 当前列表选中项
             */
            selection: Core.APIs.EACHTTP.Device.List;

            /**
             * 确认禁用的设备
             */
            confirmDisableDevices: Array<string>;

            /**
             * 确认擦除的设备
             */
            confirmEraseDevices: Array<string>;

            /**
             * 列表选中项 {[udid]:boolean}
             */
            selectOpitions: object;
        }
    }
}
