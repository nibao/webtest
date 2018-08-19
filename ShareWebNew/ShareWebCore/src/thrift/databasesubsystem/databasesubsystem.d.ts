declare namespace Core {
    namespace DatabaseSubsystem {

        /**
         * 第三方数据库信息
         */
        type ncTExternalDBInfo = {
            /**
             *  第三方数据库地址
             */
            db_host: string;

            /**
             *第三方数据库端口 
             */
            db_port: string;

            /**
             * 第三方数据库用户
             */
            db_user: string;

            /**
             * 第三方数据库密码
             */
            db_password: string;
        }
    }
}