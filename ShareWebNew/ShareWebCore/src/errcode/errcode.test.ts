import { expect } from 'chai';
import { OpType } from '../optype/optype';
import { getErrorTemplate, getErrorMessage } from './errcode';
import __ from './locale'
declare const { describe, it }


describe('ShareWebCore', () => {
    describe('errcode', () => {


        describe('根据异常码获取异常提示#getErrorMessage', () => {

            it('传入正确错误码：返回正确的异常提示信息', () => {
                expect(getErrorMessage(400001)).equal(__('不支持的接口'));
            });

            it('传入错误码403002和正确的optype：返回正确的异常提示信息', () => {
                expect(getErrorMessage(403002, OpType.DOWNLOAD)).equal(__('您没有下载权限。'));
            });

            it('传入错误码403002，不传或者传入错误optype：不返回提示信息', () => {
                expect(getErrorMessage(403002)).to.be.a('string').that.be.empty;
            });

            it('传入未知错误码：返回正确的异常提示信息', () => {
                expect(getErrorMessage(0)).equal(__('未知的错误码'));
            });

        });


        describe('根据错误码获取In18异常信息模版#getErrorTemplate', () => {

            it('获取异常模版函数', () => {
                const notExisted = getErrorTemplate(404006);
                expect(notExisted).be.a('function');
                expect(notExisted({ filename: '测试.txt' })).equal(__('文件或文件夹“${filename}”不存在, 可能其所在路径发生变更。', { filename: '测试.txt' }))
            });

        });


    })
})