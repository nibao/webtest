declare namespace Core {
    namespace DownloadLimit {

        //共享者类型
        enum SharerType {
            //用户
            USER = 1,
            //部门
            DEPT = 2
        }

        //文档下载限制配置管理对象
        type ncTDocDownloadLimitObject = {
            // 限速对象id
            objectId: string;
            // 限速对象名称
            objectName: string ;
        }

        //文档下载限制配置管理信息
        type ncTDocDownloadLimitInfo  = {
             // 唯一标识
            id?: string;
            // 最大允许的单日下载量
            limitValue?: number,
             // 用户列表
            userInfos: ncTDocDownloadLimitObject;
             // 部门列表
            depInfos:ncTDocDownloadLimitObject;
        }

    }
}