declare namespace Core {
    namespace ClientAPI {

        interface Options {
            /**
             * 返回数据的读取方式
             */
            readAs?: string;
        }

        interface ClientAPI {
            (resource: string, method: string, body: any, options?: Options): Promise<any>
        }
    }
}