declare namespace UI {
    namespace ScrollView {
        interface Props extends React.Props<any> {

            /**
             * 容器宽度
             */
            width: number | string;

            /**
             * 容器高度
             */
            height: number | string;

            /**
             * 内容区域的scrolltop,默认为0
             */
            scrollViewTop: number;

            /**
             * 内容区域的scrollleft,默认为0
             */
            scrollViewLeft: number;

            /**
             * 内容区域的横向或纵向滚动位置发生变化时回调
             * @prame:top:内容区域的scrolltop,若没有变化，则传undefined
             * @prame:left:内容区域的scrollleft,若没有变化，则传undefined
             * @prame:containerHeight:容器的高度
             */
            onScroll(top: number | undefined, left: number | undefined, containerHeight: number): void;

            /**
             * 容器大小发生变化时回调
             * @prame:containerWidth:容器的宽度
             * @prame:containertHeight:容器的高度
             */
            doChangeScrollViewSize(containerWidth: number, containertHeight: number): void;
        }

        interface State {

            /**
             * 竖向滚动条滑块高度
             */
            barHeight: number;

            /**
             * 横向滚动条滑块宽度
             */
            barWidth: number;

            /**
             * 竖向滚动条是否存在
             */
            scrollY: boolean;

            /**
             * 横向滚动条是否存在
             */
            scrollX: boolean;

            /**
             * 竖向滚动条距离顶部高度
             */
            scrollBarTop: number;

            /**
             * 横向滚动条距离左边宽度
             */
            scrollBarLeft: number;

            /**
             * 内容区的scrollTop
             */
            scrollViewTop: number;

            /**
             * 内容区的scrollLeft
             */
            scrollViewLeft: number
        }
    }
}