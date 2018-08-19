export default (req, res) => {
    res.send([{
        rev: 'DD7A687AF35245FC9BE9B2C5A3875607',
        name: 'test1.doc',
        editor: 'zhangsan',
        modified: 1509561981199147
    }, {
        rev: '1C083A5508D54E6E9D49BECDAD9A174F',
        name: 'test2.doc',
        editor: 'lisi',
        modified: 1509561793204032
    }]);
}