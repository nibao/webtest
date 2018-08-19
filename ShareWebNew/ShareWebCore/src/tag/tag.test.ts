import { expect } from 'chai'
import {
    ReqStatus,
    testIllegalCharacter,
    ErrorCode,
    getErrorMessage
} from './tag'
import __ from './locale'

describe('ShareWebCore', () => {
    describe('tag', () => {
        it('导出请求状态枚举#ReqStatus', () => {
            expect(ReqStatus.Pending).to.equal(1)
            expect(ReqStatus.OK).to.equal(2)
        })

        it('检测字符串中是否含有 # \ / : * ? " < > | 非法字符#testIllegalCharacter', () => {
            expect(testIllegalCharacter('abc123-+@~')).to.be.false
            expect(testIllegalCharacter('#')).to.be.true
            expect(testIllegalCharacter('\\')).to.be.true
            expect(testIllegalCharacter('/')).to.be.true
            expect(testIllegalCharacter(':')).to.be.true
            expect(testIllegalCharacter('*')).to.be.true
            expect(testIllegalCharacter('?')).to.be.true
            expect(testIllegalCharacter('"')).to.be.true
            expect(testIllegalCharacter('<')).to.be.true
            expect(testIllegalCharacter('>')).to.be.true
            expect(testIllegalCharacter('|')).to.be.true
            expect(testIllegalCharacter('#\\/:*?"<>|]')).to.be.true
            expect(testIllegalCharacter('a#c\\1/3:_*-?+"<=>@|%]')).to.be.true
        })

        it('正确导出错误码枚举#ErrorCode', () => {
            expect(ErrorCode.FileNotExist).to.equal(404006)
            expect(ErrorCode.NO_EDIT_PERMISSION).to.equal(403002)
            expect(ErrorCode.TAGS_REACH_UPPER_LIMIT).to.equal(403092)
            expect(ErrorCode.LACK_OF_CSF).to.equal(403065)
            expect(ErrorCode.ILLEGAL_CHARACTER).to.equal(10)
        })

        it('获取对应的errormessage#getErrorMessage', () => {
            expect(getErrorMessage(ErrorCode.FileNotExist)).to.equal(__('请求的文件不存在。'))
            expect(getErrorMessage(ErrorCode.NO_EDIT_PERMISSION)).to.equal(__('您对选中的文件没有修改权限。'))
            expect(getErrorMessage(ErrorCode.LACK_OF_CSF)).to.equal(__('您对选中的文件密级不足。'))
            expect(getErrorMessage(ErrorCode.TAGS_REACH_UPPER_LIMIT, 10)).to.equal(__('最多可添加${maxTagNum}个标签。', { maxTagNum: 10 }))
            expect(getErrorMessage(ErrorCode.ILLEGAL_CHARACTER)).to.equal(__('标签名不能包含 # \\ / : * ? " < > | 特殊字符。'))
            expect(getErrorMessage()).to.equal('')

        })
    })
})