declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace AutoLock {
                /**
                 * 手动锁
                 */
                type Lock = Core.APIs.OpenAPI<{
                    /**
                     * 文件id
                     */
                    docid: string;
                }, void>


                /**
                 * 尝试文件加锁
                 * 文件未锁定时，尝试锁定文件；否则返回锁定者信息
                 */
                type TryLock = Core.APIs.OpenAPI<{

                    /**
                     * 文件id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.TryLock | void>


                /**
                 * 刷新文件锁
                 */
                type Refresh = Core.APIs.OpenAPI<{
                    /**
                     * 锁信息
                     */
                    lockinfos: Array<string>
                }, Array<Core.APIs.EACHTTP.RefreshLock>>


                /**
                 * 解锁
                 */
                type Unlock = Core.APIs.OpenAPI<{

                    /**
                     * 文件id
                     */
                    docid: string;
                }, void>

                /**
                 * 获取锁信息
                 */
                type GetLockInfo = Core.APIs.OpenAPI<{

                    /**
                     * 文件id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.LockInfo>

                /**
                 * 获取文件夹锁信息
                 */
                type GetDirLockInfo = Core.APIs.OpenAPI<{

                    /**
                     * 文件夹id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.DirLockInfo>
            }
        }
    }
}