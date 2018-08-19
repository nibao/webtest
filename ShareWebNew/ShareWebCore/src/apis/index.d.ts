declare namespace Core {
    namespace APIs {
        /**
         * 开放API调用函数
         * @param P 请求参数
         * @param R 响应内容
         */
        type OpenAPI<P, R> = (params?: P, options?: Core.OpenAPI.OpenAPIOptions) => Promise<Readonly<R>>

        /**
         * 客户端API调用函数
         * @param P 请求参数
         * @param R 响应内容
         */
        type ClientAPI<P, R> = (params?: P, options?: Core.ClientAPI.Options) => Promise<Readonly<R>>

    }
}