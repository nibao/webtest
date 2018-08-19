import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 获取侧边栏选中项
 * @param id 窗口id
 */
export const getSelectItemsById: Core.APIs.Client.Sidebar.GetSelectItemsById = function ({ id }) {
    return clientAPI('sidebar', 'GetSelectItemsById', { id });
}