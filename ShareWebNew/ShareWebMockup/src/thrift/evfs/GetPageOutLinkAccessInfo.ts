/**
 * 分页获取外链访问信息
 */
export default (req, res) => {
    res.send([{
        id: 2,
        rev: '1680F66E8DA448B5AFC27F70B84899CC',
        fileName: 'VMware-Fusion-7.1.1-2498930.dmg',
        filePath: '张三/VMware-Fusion-7.1.1-2498930.dmg',
        ip: '192.168.1.14',
        date: 1499077382824854,
        opType: 14,
        gns: 'gns://09073D6B719F40CAA282594EDF9E68F6/0A9E8E7EC0C6400A9544FCD1303BBBEA'
    }, {
        id: 1,
        rev: '48DA1688B58242DC84A6C18FFBBBE5E1',
        fileName: '微信截图_20170720102513.png',
        filePath: '张三/微信截图_20170720102513.png',
        ip: '192.168.1.14',
        date: 1499412726725574,
        opType: 13,
        gns: 'gns://09073D6B719F40CAA282594EDF9E68F6/422A37B560434BB5B7C8A70524FD44EC'
    }]);
}