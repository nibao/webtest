declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Sidebar {

                /**
                 * 通过窗口id获取当前选中的文档
                 */
                type GetSelectItemsById = Core.APIs.ClientAPI<{

                    /**
                     * 窗口id
                     */
                    id: string
                }, Core.APIs.Client.SelectedItems>
            }
        }
    }
}