declare namespace Console {
    namespace SharedVisibility {
        interface State {
            /**
             * “屏蔽组织结构用户成员信息”状态
             */
            hideUserStatus: boolean;

            /**
             * “屏蔽组织结构信息”状态
             */
            hideOrgStatus: boolean;

            /**
             * 搜索框的值
             */
            value: string;

            /**
             * 部门
             */
            departments: ReadonlyArray<Department>;

            /**
             * 添加部门组件是否显示
             */
            showOrganizationPicker: boolean;

            /**
             * 搜索方式模糊或精确
             */
            exactSearch: boolean;

            /**
             * 搜索范围
             */
            searchRange: number;

            /**
             * 显示范围
             */
            searchResults: number;

            /**
             * 是否改变显示用户名设置
             */
            changed: boolean;
        }

        /**
         * 部门信息
         */
        interface Department {
            /**
             * 部门id
             */
            departmentId: string;

            /**
             * 部门名称
             */
            departmentName: string;

            /**
             * 其他的属性
             */
            [key: string]?: any;
        }
    }
}