declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Invitation {
                /**
                 * 打开邀请链接
                 */
                type Open = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.InvitationBaseInfo>;


                /**
                 * 设置共享邀请基本信息
                 */
                type SetBaseInfo = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 邀请链接的有效期，-1为无限期
                     */
                    invitationendtime: number;

                    /**
                     * 权限
                     */
                    perm: number;

                    /**
                     * 权限有效期
                     */
                    permendtime: number;
                }, void>;


                /**
                 * 根据文档id获取共享邀请基本信息
                 */
                type GetBaseInfoByDocId = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.InvitationBaseInfo>;


                /**
                 * 设置共享邀请备注信息
                 */
                type SetNoteInfo = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 邀请图标
                     */
                    image: string;

                    /**
                     * 描述
                     */
                    description: string;

                }, void>;


                /**
                 * 根据文档id获取图片备注信息
                 */
                type GetNoteInfoByDocId = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.InvitationNote>;


                /**
                 * 关闭共享邀请
                 */
                type Close = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, void>;


                /**
                 * 根据InvitationId 根据文档id获取共享邀请所有信息
                 */
                type Get = Core.APIs.OpenAPI<{
                    /**
                     * 共享邀请id
                     */
                    invitationid: string;
                }, Core.APIs.EACHTTP.InvitationInfo>;


                /**
                 * 加入群组
                 */
                type Join = Core.APIs.OpenAPI<{
                    /**
                     * 共享邀请id
                     */
                    invitationid: string;
                }, Core.APIs.EACHTTP.InvitationJoinResult>;
            }
        }
    }
}