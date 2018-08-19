declare namespace Console {
  namespace UploadLimitation {

    interface Props extends React.Props<void> {

    }

    interface State {
      /**
       * 具体文件类型信息
       */
      config: Array<any>;

      /**
       * 保存取消按钮是否显示
       */
      visible: boolean;

      /**
       * validateStatus显示信息
       */
      validateStatus: {
        /**
         * 文档类对应的显示信息
         */
        1: number,

        /**
         * 视频/音频对应的显示信息
         */
        2: number,

        /**
         * 图片对应的显示信息
         */
        3: number,

        /**
         * 压缩包对应的显示信息
         */
        4: number,

        /**
         * 可疑文件对应的显示信息
         */
        5: number,

        /**
         * 病毒文件对应的显示信息
         */
        6: number,

        /**
         * 其它对应的显示信息
         */
        7: number,
      }
    }
  }
}