declare namespace Components {
    namespace Image {
        interface Props extends React.Props<any> {
            //图片url
            url?: string;

            //文档信息
            doc?: {
                //docid
                docid: string;

                //文件名
                name: string;
            };

            //外链信息
            link?: {
                // 外链id
                link: string;

                // 外链密码
                password: string;
            };

            //图片列表
            list?: Array<any>;

            // 权限
            perm: number;

            // 分组小大
            groupSize?: number;

            // 缩略图
            gallery?: Array<any>

            //通过gallery切换图片
            applyImage?: (target: Object) => any;

            //图片切换事件
            onChange?: any;
        }

        type State = {
            //图片资源
            src: string;

            //虚拟图片文档 移动端切换图片时使用
            currentDoc: any;

            //下载链接
            downloadURL: string;
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}