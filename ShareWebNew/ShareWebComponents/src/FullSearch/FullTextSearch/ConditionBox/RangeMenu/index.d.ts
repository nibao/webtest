declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            namespace RangeMenu {
                interface Props extends React.Props<any> {

                    /**
                     * 是否有单位或类型
                     */
                    enableType: boolean;

                    /**
                     * 单位种类
                     */
                    rangeTypes: Array<string>;

                    /**
                     * 标题文字
                     */
                    label: string;

                    /**
                     * 样式
                     */
                    className?: string;

                    /**
                     * 默认的范围对象
                     */
                    rangeInfo: {
                        rangeLeftValue: string;
                        rangeRightValue: string;
                        rangeLeftType: string;
                        rangeRightType: string;
                    }


                }

                interface State {
                    /**
                     * 范围对象
                     */
                    rangeInfo: {
                        rangeLeftValue: string;
                        rangeRightValue: string;
                        rangeLeftType: string;
                        rangeRightType: string;
                    }

                    /**
                     * 点击状态
                     */
                    clickStatus: boolean;
                }
            }

        }
    }
}