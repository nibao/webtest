declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Audit {
                /**
                 * 我的共享申请
                 */
                type GetApplys = Core.APIs.OpenAPI<void | null, Core.APIs.EACHTTP.MyApplys>

                /**
                 * 待审核的共享申请
                 */
                type GetPendingApprovals = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.ApplyApprovals>

                /**
                 * 待审核的共享申请数
                 */
                type GetPendingApprovalsCount = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.AuditCount>

                /**
                 * 待审流程信息
                 */
                type GetDocApprovals = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.DocApprovals>

                /**
                 * 所有流程信息
                 */
                type GetDocProcesses = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.DocProcesses>

                /**
                 * 发起流程申请
                 */
                type PublishDoc = Core.APIs.OpenAPI<{
                    /**
                     * 流程id
                     */
                    processid: string;

                    /**
                     * 文档id，可以是文件夹，文件
                     */
                    docid: string;

                    /**
                     * 发起流程时的理由
                     */
                    applymsg: string;

                    /**
                     * 内外网数据交换文档接收位置
                     */
                    dstdocname?: string;
                }, Core.APIs.EACHTTP.PublishDocs>

                /**
                 * 申请中的流程信息
                 */
                type GetDocApplys = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.DocApplys>

                /**
                 * 流程申请历史总数量
                 */
                type GetApplyHistoryCount = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.AuditCount>

                /**
                 * 流程申请历史
                 */
                type GetApplyHistory = Core.APIs.OpenAPI<{
                    /**
                     * 分页开始号，从0开始
                     */
                    start: number;

                    /**
                     * 条数，表示取多少条日志，-1表示不限制
                     */
                    limit: number;
                }, Core.APIs.EACHTTP.ApplyHistorys>

                /**
                * 流程审核历史总数量
                */
                type GetApproveHistoryCount = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.AuditCount>

                /**
                * 流程审核历史
                */
                type GetApproveHistory = Core.APIs.OpenAPI<{
                    /**
                     * 分页开始号，从0开始
                     */
                    start: number;

                    /**
                     * 条数，表示取多少条日志，-1表示不限制
                     */
                    limit: number;
                }, Core.APIs.EACHTTP.ApproveHistorys>

                /**
                * 共享申请历史数量
                */
                type GetShareApplyHistoryCount = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.AuditCount>

                /**
                * 共享申请历史
                */
                type GetShareApplyHistory = Core.APIs.OpenAPI<{
                    /**
                     * 分页开始号，从0开始
                     */
                    start: number;

                    /**
                     * 条数，表示取多少条日志，-1表示不限制
                     */
                    limit: number;
                }, Core.APIs.EACHTTP.ShareApplyHistorys>

                /**
                * 共享审核历史数
                */
                type GetShareApproveHistoryCount = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.AuditCount>


                /**
                * 共享申请历史
                */
                type GetShareApproveHistory = Core.APIs.OpenAPI<{
                    /**
                     * 分页开始号，从0开始
                     */
                    start: number;

                    /**
                     * 条数，表示取多少条日志，-1表示不限制
                     */
                    limit: number;
                }, Core.APIs.EACHTTP.ShareApproveHistorys>

                /**
                 * 共享审核
                 */
                type Approve = Core.APIs.OpenAPI<{
                    /**
                     * 申请记录id
                     */
                    applyid: string;

                    /**
                     * 审核结果，true表示通过，false表示拒绝
                     */
                    result: boolean;

                    /**
                     * 审核说明
                     */
                    msg: string;
                }, void>

                /**
                 * 流程审核
                 */
                type ApproveDoc = Core.APIs.OpenAPI<{
                    /**
                     * 申请记录id
                     */
                    applyid: string;

                    /**
                     * 审核结果，true表示通过，false表示拒绝
                     */
                    result: boolean;

                    /**
                     * 审核说明
                     */
                    msg: string;
                }, void>

                /**
                 * 获取待审核条目
                 */
                type Getpendingapprovalscounts = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.Pendingapprovalscounts>
            }
        }
    }
}