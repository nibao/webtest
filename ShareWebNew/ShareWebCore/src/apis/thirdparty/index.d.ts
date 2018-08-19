declare namespace Core {
    namespace APIs {
        namespace THIRDPARTY {

            /**
             * 爱数保存资源文件到资源中心
             */

            /**
             * 资源中心TOKEN
             */
            interface ResourceShareToken {
                access_token: string;
                token_type: string;
                expires_in: string;
                scope: string;
            }

            /**
             * 资源中心学段列表
             */
            interface ResourceSharePhase {
                code: string;
                data: object;
            }

            /**
             * 资源中心学科列表
             */
            interface ResourceShareSubject {
                code: string;
                data: object;
            }

            /**
             * 资源中心版本列表
             */
            interface ResourceShareEdition {
                code: string;
                data: object;
            }

            /**
            * 资源中心年级列表
            */
            interface ResourceShareGrade {
                code: string;
                data: object;
            }

            /**
            * 资源中心册别列表
            */
            interface ResourceShareVolume {
                code: string;
                data: object;
            }

            /**
            * 资源中心教材列表
            */
            interface ResourceShareBook {
                code: string;
                data: object;
            }

            /**
             * 资源中心教材目录列表
             */
            interface ResourceShareUnit {
                code: string;
                data: object;
            }

            /**
             * 资源中心资源类型列表
             */
            interface ResourceShareType {
                code: string;
                data: object;
            }

            /**
             * 保存到资源中心
             */
            interface ResourceShareCenter {
                code: number;
                msg: string;
            }

            /**
             * 爱数分享资源到个人空间和班级空间
             */

            /**
             * 获取账号验证的信息
             */
            interface ResourceShareValidationResponse {
                data: string;
                status: number;
            }
            interface ResourceShareValidation {
                status: number;
                response: ResourceShareValidationResponse;
            }

            /**
             * 获取用户信息
             */
            interface ResourceShareUserInfoResponse {
                data: object;// 用户信息
                status: number; // 返回状态
            }
            interface ResourceShareUserInfo {
                status: number; // 状态码
                response: ResourceShareUserInfoResponse
            }

            /* 分享到班级空间返回结果 */
            interface ShareToClassSpaceResponse {
                code: string;
                msg: string;
            }
            interface ShareToClassSpaceRes {
                status: number;
                response: ShareToClassSpaceResponse;
            }
            /* 分享到个人空间返回结果 */
            interface ShareToPersonSpaceResponse {
                data: string;
                msg: string;
                status: string;
            }
            interface ShareToPersonSpaceRes {
                status: number;
                response: ShareToPersonSpaceResponse;
            }

        }
    }
}