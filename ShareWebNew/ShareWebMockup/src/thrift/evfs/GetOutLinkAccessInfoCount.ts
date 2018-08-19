/**
 * 获取外链访问信息总数
 */
export default (req, res) => {
    res.send({
        count: 2,
        maxId: 8
    });
}