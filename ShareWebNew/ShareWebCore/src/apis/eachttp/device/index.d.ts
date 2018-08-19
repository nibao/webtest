declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Device {

                /**
                 * 所有设备信息
                 */
                type List = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.DeviceInfos>

                /**
                * 禁用设备
                */
                type Disable = Core.APIs.OpenAPI<{
                    /**
                     * 设备唯一标识号
                     */
                    udid: string;
                }, void>;

                /**
                * 启用设备
                */
                type Enable = Core.APIs.OpenAPI<{
                    /**
                     * 设备唯一标识号
                     */
                    udid: string;
                }, void>;

                /**
                * 擦除缓存
                */
                type Erase = Core.APIs.OpenAPI<{
                    /**
                     * 设备唯一标识号
                     */
                    udid: string;
                }, void>;

                /**
                * 获取设备状态（mobile）
                */
                type GetStatus = Core.APIs.OpenAPI<{
                    /**
                     * 设备唯一标识号
                     */
                    udid: string;
                }, Core.APIs.EACHTTP.DeviceStatus>;

                /**
                * 通知anyshare缓存擦除成功
                */
                type OnEraseSuc = Core.APIs.OpenAPI<{
                    /**
                     * 设备唯一标识号
                     */
                    udid: string;
                }, void>;

            }
        }
    }
}