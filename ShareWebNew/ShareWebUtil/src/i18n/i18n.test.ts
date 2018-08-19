import { expect } from 'chai';
import I18NFactory from './i18n';

describe('ShareWebUtil', () => {
    describe('i18n', () => {
        describe('I18N', () => {
            const i18n = I18NFactory({
                translations: ['zh-cn', 'zh-tw', 'en-us'],
                locale: 'en-us'
            });

            const __ = i18n([
                [
                    '你好，${world}',
                    '你好，${world}',
                    'Hello, ${world}'
                ],
                [
                    '未设置'
                ],
                [
                    '空字符串',
                    '',
                    ''
                ]
            ]);

            it('使用模版标记时使用变量替换模版标记', () => {
                expect(__('你好，${world}', { world: 'world' })).to.equal('Hello, world');
            });

            it('资源缺少某种语言的的情况下，返回用作查找的资源项', () => {
                expect(__('未设置')).to.equal('未设置');
            });

            it('缺少国际化，返回空字符串', () => {
                expect(__('无资源文件')).to.equal('');
            });

            it('空字符串原样返回', () => {
                expect(__('空字符串')).to.equal('');
            });

            it('改变locale', () => {
                i18n.setup({ locale: 'zh-cn' });

                expect(__('你好，${world}', { world: 'world' })).to.equal('你好，world');
            });

            it('使用不在translations中定义的语言类型，如果是zh开头则返回简体中文', () => {
                i18n.setup({ locale: 'zh-xx' });

                expect(__('你好，${world}', { world: 'world' })).to.equal('你好，world');
            });

            it('使用不在translations中定义的语言类型，如果是en开头则返回英文资源', () => {
                i18n.setup({ locale: 'en-xx' });

                expect(__('你好，${world}', { world: 'world' })).to.equal('Hello, world');
            });

            it('使用不在translations中定义的语言类型，如果是任意语言类型开头则返回英文资源', () => {
                i18n.setup({ locale: 'fr-xx' });

                expect(__('你好，${world}', { world: 'world' })).to.equal('Hello, world');
            })
        });
    });
})