import { expect } from 'chai'
import * as exception from './exception'
import __ from './locale'

describe('ShareWebCore', () => {
    describe('exception', () => {
        describe('获取异常提示模版#getErrorTemplate', () => {
            it('错误码在已知错误码内，正确返回错误提示码模板', () => {
                expect(exception.getErrorTemplate(10005)()).to.equal(__('添加失败，指定的站点已属于其它的分布式系统。'))
                expect(exception.getErrorTemplate(20154)()).to.equal(__('该用户名已被管理员占用，请重新输入。'))
            })

            it('未知错误码，返回未知错误吗提示模板', () => {
                expect(exception.getErrorTemplate(123)()).to.equal(__('未知的错误码'))
            })
        })

        it('根据异常码获取异常提示#getErrorMessage（暂时不存在数组类型错误信息，因此暂不测试）')

    })
})