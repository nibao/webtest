declare namespace Components {

    namespace Helper {
        /**
         * Action 函数
         * @params [props] action参数
         */
        type Action = (props?: { [key: string]: any }) => { type: string, [key: string]: any }

        /**
         * 异步Action
         */
        type AsyncAction = (dispatch, getState) => PromiseLike<any>

        /**
         * Action构造器
         * @params type action名称
         * @params props action属性
         */
        type CreateAction<T> = (type: string, props?: Array<string> | Array<[string, any]> | Function) => T | AsyncAction;

        /**
         * Reducer 函数
         */
        type Reducer = (state: any, action: { type: string, [key: string]: any; }) => any

        /**
         * Reducer构造器
         * @params type 处理的action名称
         * @params handler action处理函数
         */
        type CreateReducer<T> = (type: string, handler: Reducer) => T

        /**
         * Component构造器
         */
        type CreateComponent = (store: Object, handler: (store: Object) => Function) => Function
    }

}