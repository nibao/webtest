declare namespace Components {
    namespace Sync {
        namespace Unsync {
            interface Props extends React.Props<void> {

                /** 
                 * 未同步集合 
                 */
                unSyncs: Array<Core.APIs.Client.UnsyncInfo>;

                /** 
                 * 未同步总数 
                 */
                unSyncsNum: number

                /** 
                 * 未同步总数 
                 */
                isSelectDir: boolean;

                /** 
                 * 浏览本地目录 
                 * @param absPaths 绝对路径集合
                 */
                selectDir: (absPaths: Array<string>) => void;

                /** 
                 * 上传 
                 * @param absPaths 绝对路径集合
                 */
                uploadUnsync: (absPaths: Array<string>) => void;

                /** 
                 * 转移 
                 * @param dirPath 目标路径
                 */
                transferUnsyc: (dirPath: string) => void;

                /**
                 * 选中文件夹事件
                 */
                onSelectDir: () => void;

                /**
                  * 根据绝对路径打开当前文件所在目录
                  * @param absPath 绝对路径
                  */
                openDirByAbsPath: (absPath: string) => void;
            }
        }
    }

}