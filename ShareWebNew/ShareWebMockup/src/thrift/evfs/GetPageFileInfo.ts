export default (req, res) => {
    res.send([{
        docId: 'gns://09073D6B719F40CAA282594EDF9E68F6/E45AB0E3EC00442E8AA1EFF9C00B1842/7D3E7A47277644FA9DB2BC9F1B855A47',
        path: 'zhangsan/Recycle Bin/留底审计2.doc',
        retained: true,
        attribute: {
            creator: 'zhangsan',
            createTime: 1509561793204032,
            csfLevel: 9,
            name: '留底审计2.doc'
        },
        metadata: {
            rev: 'DD7A687AF35245FC9BE9B2C5A3875607',
            name: '留底审计2.doc',
            editor: 'zhangsan',
            modified: 1509561981199147
        }
    }, {
        docId: 'gns://09073D6B719F40CAA282594EDF9E68F6/E45AB0E3EC00442E8AA1EFF9C00B1842/F0C5AF3078ED4CCDBD6B8397AD87E4F3/DB648E3F96FB468E81878F3C749CC6D6/A9AC7EC28F394A04AE33BCB480D632A5',
        path: 'lisi/Recycle Bin/pdfjs-dist/cmaps/test2.doc',
        retained: false,
        attribute: {
            creator: 'lisi',
            createTime: 1499907548506862,
            csfLevel: 6,
            name: 'test2.doc'
        },
        metadata: {
            rev: '25F465CD32134918A84292CE2F002732',
            name: 'test2.doc',
            editor: 'lisis',
            modified: 1499907548506862
        }
    }]);
}