
declare namespace Components {
    namespace Quota {
        type Props = {}
        type State = {
            /**
             * 容量百分比数据
             */
            data: Array<any>,
            /**
             * 已使用容量
             */
            usedQuota: number,
            /**
             * 总容量
             */
            totalQuota: number
        }
        interface Base {
            props: Props
            state: State
        }
    }

}   