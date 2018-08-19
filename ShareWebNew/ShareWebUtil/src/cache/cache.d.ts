declare namespace Utils {
    namespace Cache {
        /**
         * 取值
         * @param [options.update] 如果缓存的值是函数，则再次调用函数并返回结果
         */
        type Cached = (options?: { update?: boolean }) => any
    }
}