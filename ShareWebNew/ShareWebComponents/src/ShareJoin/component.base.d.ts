declare namespace Components {
    namespace ShareJoin {
        interface Props {
            invitationid: string;
        }

        interface State {
            // 邀请链接有效期
            invitationendtime: string ;
            // 权限
            perm: string ;
            // 权限有效期
            permendtime: string ;
            //显示提示状态
            message: boolean;
            // 图片
            image: string ;
            // 备注
            description: string ;
            // 文件名
            docname: string ;
            //是否是文件夹
            isdir: boolean;
        }
        interface Base {
            props: Props;

            state: State;
        }
    }
}