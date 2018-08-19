declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {
            namespace Favorites {

                /**
                  * 添加收藏
                  */
                type Add = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件或文件夹gns路径（目录列举协议返回）
                         */
                        docid: string;
                    },
                    void
                    >


                /**
                 * 获取收藏列表
                 */
                type List = Core.APIs.OpenAPI<
                    {

                    },
                    ReadonlyArray<Core.APIs.EFSHTTP.FavoritesInfo>
                    >


                /**
                * 删除收藏
                */
                type Del = Core.APIs.OpenAPI<
                    {

                        /**
                         * 文件或文件夹gns路径（目录列举协议返回）
                         */
                        docid: string;
                    },
                    void
                    >

                /**
                * 批量查询收藏状态
                */
                type Check = Core.APIs.OpenAPI<
                    {

                        /**
                         * 文件或文件夹gns数组
                         */
                        docids: ReadonlyArray<string>;
                    },
                    ReadonlyArray<Core.APIs.EFSHTTP.FavoritedInfo>
                    >
            }
        }
    }
}