declare namespace Core {

    /**
     * 水印
     */
    namespace Watermark {

        interface WatermarkOpts {

            /**
             * 缩放比例
             */
            zoom: number

            /**
             * 返回类型
             * canvas 元素
             * base64 图片
             */
            type: string
        }

        /**
         * 水印函数
         */
        interface Watermark {
            (opts: WatermarkOpts): { src: HTMLCanvasElement | string, layout: number } | null
        }

        /**
         * 根据水印配置返回水印函数
         */
        interface WatermarkFactory {
            (doc): Promise<Watermark>
        }
    }
}