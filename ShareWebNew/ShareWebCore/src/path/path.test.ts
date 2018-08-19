import { expect } from 'chai';
import * as entrydoc from '../entrydoc/entrydoc';
import { sandboxStub } from '../../libs/test-helper';

import { decode, encode, relative } from './path';


describe('ShareWebCore', () => {
    describe('path', () => {
        const sandbox = sinon.createSandbox()
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: entrydoc,
                    moduleProp: ['getResolvedByTypeDB']
                }
            ])
        });
        afterEach('restore', () => {
            sandbox.restore()
        });

        describe('编码路径#encode', () => {

            it('路径中包含单个需编码字符', () => {
                expect(encode('a#')).to.equal('a%23');
                expect(encode('a?')).to.equal('a%3F');
                expect(encode('a%')).to.equal('a%25');
            });

            it('路径中包含多个需编码字符', () => {
                expect(encode('a#b?c%')).to.equal('a%23b%3Fc%25');
            });

            it('路径中不包含需编码字符', () => {
                expect(encode('abc://文件夹/a/a.txt')).to.equal('abc://文件夹/a/a.txt');
            });

        });


        describe('解码路径#decode', () => {

            it('路径中包含单个需解码字符', () => {
                expect(decode('a%23')).to.equal('a#');
                expect(decode('a%3F')).to.equal('a?');
                expect(decode('a%25')).to.equal('a%');
            });

            it('路径中包含多个需解码字符', () => {
                expect(decode('a%23b%3Fc%25')).to.equal('a#b?c%');
            });

            it('路径中不包含需解码字符', () => {
                expect(decode('abc://文件夹/a/a.txt')).to.equal('abc://文件夹/a/a.txt');
            });

        });

        it('计算相对路径，返回完整路径#relative', () => {
            expect(relative('', 'a')).to.equal('a')
            expect(relative('', 'a/b')).to.equal('a/b')
            expect(relative('', '..')).to.equal('')
            expect(relative('', '../a/b')).to.equal('a/b')
            expect(relative('', 'a/../b')).to.equal('b')

            expect(relative('a', '../b')).to.equal('b')
            expect(relative('a/b', '../../c')).to.equal('c')
            expect(relative('a/b/c', 'd/../e')).to.equal('a/b/c/e')

            expect(relative('', '')).to.equal('')
            expect(relative('a', '')).to.equal('a')
            expect(relative('a/b', '')).to.equal('a/b')
            expect(relative('a/b/c', '')).to.equal('a/b/c')

        });

        // TODO:构建路径数组
        describe('构建路径数组#mapPath', () => {
            it('路径存在', () => {
                
            });

            it('路径部分存在', () => {

            });

            it('路径不存在，返回null', () => {

            });
        });

        // TODO:构建外链路径数组

        it('构建外链路径数组#mapLinkPath', () => {

        });



    });
});