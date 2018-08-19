declare namespace Core {
    namespace LinkConfig {

        /**
         * 权限
         */
        interface Perm {
            name: string;
            value: number;
            require: number[];
        }
    }
}