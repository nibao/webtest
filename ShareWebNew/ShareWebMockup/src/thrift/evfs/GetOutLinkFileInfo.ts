/**
 * 获取外链文件信息
 */
export default (req, res) => {
    res.send({
        creator: '张一',    // 创建者
        editor: '张二',     // 修改者
        modified: 1500622804456384,  // 修改时间
        sharer: '张三',     // 共享着
        sharedObj: '摘要.doc' // 共享文档
    });
}