declare namespace Core {
    namespace APIs {
        namespace THIRDPARTY {
            namespace ResourceShare {

                /**
                 * 资源中心获取token
                 */
                type GetToken = Core.APIs.OpenAPI<void, Readonly<Core.APIs.THIRDPARTY.ResourceShareToken>>

                /**
                 * 资源中心获取学段列表
                 */
                type PhaseList = Core.APIs.OpenAPI<{
                    access_token: string;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceSharePhase>>

                /**
                 * 资源中心获取学科列表
                 */
                type SubjectList = Core.APIs.OpenAPI<{
                    access_token: string;
                    phase: object;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareSubject>>

                /**
                * 资源中心获取版本列表
                */
                type EditionList = Core.APIs.OpenAPI<{
                    access_token: string;
                    phase: object;
                    subject: object;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareEdition>>

                /**
               * 资源中心获取年级列表
               */
                type GradeList = Core.APIs.OpenAPI<{
                    access_token: string;
                    phase: object;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareGrade>>

                /**
                * 资源中心获取册别列表
                */
                type VolumeList = Core.APIs.OpenAPI<{
                    access_token: string;
                    phase: object;
                    subject: object;
                    edition: object;
                    grade: object;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareVolume>>

                /**
                * 资源中心获取教材列表
                */
                type BookList = Core.APIs.OpenAPI<{
                    access_token: string;
                    phase: object;
                    subject: object;
                    edition: object;
                    grade: object;
                    volume: object;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareBook>>

                /**
                * 资源中心获取教材目录列表
                */
                type UnitList = Core.APIs.OpenAPI<{
                    access_token: string;
                    bookCode: object;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareUnit>>

                /**
               * 资源中心获取资源类型列表
               */
                type TypeList = Core.APIs.OpenAPI<{
                    access_token: string;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareType>>

                /**
                * 保存资源文件到资源中心
                */
                type ShareCenter = Core.APIs.OpenAPI<{
                    access_token: string;
                    url: string;
                    filename: string;
                    creator: string;
                    uploader: string;
                    type: Array<string>;
                    book: string;
                    volume: string;
                    unit1: Array<string>;
                    unit2?: Array<string>;
                    unit3?: Array<string>;
                    unit4?: Array<string>;
                    grade: Array<string>;
                    subject: Array<string>;
                    phase: Array<string>;
                    edition: Array<string>;
                }, ReadonlyArray<Core.APIs.THIRDPARTY.ResourceShareCenter>>

                /* 账号验证 */
                type UserValidation = Core.APIs.OpenAPI<{
                    user: string
                }, Core.APIs.THIRDPARTY.ResourceShareValidation>

                /* 获取用户信息 */
                type UserInfo = Core.APIs.OpenAPI<{
                    user: string;
                    key: string;
                }, Core.APIs.THIRDPARTY.ResourceShareUserInfo>

                /* 分享资源到班级空间 */
                type ShareToClassSpace = Core.APIs.OpenAPI<{
                    extension: string, // 文件扩展名
                    cyuid: string, // 用户cyuid
                    fileName: string, // 文件名
                    url: string, // 文件链接地址
                    class_id: string, // 班级id
                }, Core.APIs.THIRDPARTY.ShareToClassSpaceRes>

                /* 分享资源到个人空间 */
                type ShareToPersonSpace = Core.APIs.OpenAPI<{
                    user: string; // 用户cyuid
                    key: string; // 验证接口返回的
                    docid: string; // 文件docid路径
                    type: number; // 资源类型
                    name: string; // 文件名
                }, Core.APIs.THIRDPARTY.ShareToPersonSpaceRes>

            }
        }
    }
}