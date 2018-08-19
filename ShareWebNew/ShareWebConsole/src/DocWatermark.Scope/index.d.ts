declare namespace Components {
    namespace DocWatermarkScope {

        /**
         * 文档库水印信息配置
         */
        interface WatermarkInfo {
            /**
             * 水印文档库id
             */
            objId: string
            /**
             * 水印文档库名
             */
            objName: string
            /**
             * 文档库类型
             */
            objType: number
            /**
             * 水印类型
             */
            watermarkType: number
        }

        interface State {
            /**
             * 文档库水印列表
             */
            watermarkInfos: Array<WatermarkInfo>
            /**
             * 当前分页
             */
            page: number
            /**
             * 搜索关键字
             */
            key: string
            /**
             * 水印配置总页数
             */
            count: number
            /**
             * 添加新配置
             */
            adding: null | {
                /**
                 * 确定
                 */
                confirm: (docLibs: Array<any>) => void
                /**
                 * 取消
                 */
                cancel: () => void
            }
        }
    }
}