export enum FilterItems {
  
    /**不作任何过滤 */
    NORMAL,

    /*归档库过滤掉删除和修改*/
    HIDEDELETEANDMODIFY,

    /*开启涉密模式过滤掉删除*/
    HIDEDELETE,
}