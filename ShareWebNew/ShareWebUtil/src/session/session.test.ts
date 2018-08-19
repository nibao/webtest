import { expect } from 'chai';
import session from './session';

describe('ShareWebUtil', () => {
    describe('session', () => {
        beforeEach('清空sessionStorage', () => {
            window.sessionStorage.clear();
        });

        describe('检测session是否存在#has', () => {
            it('值存在：返回true', () => {
                window.sessionStorage.setItem('a', JSON.stringify('test'));
                expect(session.has('a')).to.be.true;
            });
            it('值不存在：返回false', () => {
                expect(session.has('b')).to.be.false;
            });
        });

        describe('获取session#get', () => {
            it('获取简单类型值', () => {
                window.sessionStorage.setItem('foo', JSON.stringify('foo'))
                expect(session.get('foo')).to.equal('foo');
            });

            it('获取引用类型值', () => {
                window.sessionStorage.setItem('object', JSON.stringify({}))
                expect(session.get('object')).to.deep.equal({});
            });

            it('获取不存在的session', () => {
                expect(session.get('aaa')).to.be.null;
            });
        });


        describe('提取出session并从存储删除#take', () => {
            it('传入存在的session字段：返回对应的值，并删除对应session字段', () => {
                window.sessionStorage.setItem('a', JSON.stringify('aaa'));
                expect(session.take('a')).to.equal('aaa');
                expect(window.sessionStorage.getItem('a')).to.be.null
            });

            it('传入不存在的session字段：返回null', () => {
                expect(session.take('a')).to.be.null;
                expect(window.sessionStorage.getItem('a')).to.be.null
            });
        });

        describe('设置session#set', () => {
            it('传入键和值：将值序列化后保存到session中', () => {
                session.set('foo', 'foo');
                expect(window.sessionStorage.getItem('foo')).to.equal(JSON.stringify('foo'));
            });

            it('只传入键：删除session中对应的键', () => {
                window.sessionStorage.setItem('foo', JSON.stringify('foo'));
                session.set('foo');
                expect(window.sessionStorage.getItem('foo')).to.be.null;
            });
        });

        describe('更新session数据#update', () => {
            it('更新普通类型', () => {
                window.sessionStorage.setItem('a', JSON.stringify('a'));
                expect(session.update('a', 'b')).to.equal('b');
                expect(window.sessionStorage.getItem('a')).to.equal(JSON.stringify('b'));
            });

            it('更新引用类型-object', () => {
                expect(session.update('object', {})).to.deep.equal({});
                expect(window.sessionStorage.getItem('object')).to.deep.equal(JSON.stringify({}));

                expect(session.update('object', { foo: 'foo' })).to.deep.equal({ foo: 'foo' });
                expect(window.sessionStorage.getItem('object')).to.deep.equal(JSON.stringify({ foo: 'foo' }));

                expect(session.update('object', { foo: 'bar' })).to.deep.equal({ foo: 'bar' });
                expect(window.sessionStorage.getItem('object')).to.deep.equal(JSON.stringify({ foo: 'bar' }));
            });


            it('更新引用类型-array', () => {
                expect(session.update('array', [])).to.deep.equal([]);
                expect(window.sessionStorage.getItem('array')).to.deep.equal(JSON.stringify([]));

                expect(session.update('array', [1, 2, 3])).to.deep.equal([1, 2, 3]);
                expect(window.sessionStorage.getItem('array')).to.deep.equal(JSON.stringify([1, 2, 3]));

                expect(session.update('array', [1, 2])).to.deep.equal([1, 2, 3, 1, 2]);
                expect(window.sessionStorage.getItem('array')).to.deep.equal(JSON.stringify([1, 2, 3, 1, 2]));
            });

            it('更新类型与原有类型不匹配：抛出"update() 数据类型不匹配"', () => {
                window.sessionStorage.setItem('obj', JSON.stringify({ a: 'a' }));
                expect(() => session.update('obj', [1, 2])).to.throw('update() 数据类型不匹配');
            });

        });


        describe('清空session', () => {
            it('session中不存在值：执行清空', () => {
                session.clear()
                expect(window.sessionStorage).to.has.lengthOf(0)
            });

            it('session中存在单个值：执行清空', () => {
                window.sessionStorage.setItem('a', 'a');
                expect(window.sessionStorage).to.has.lengthOf(1)
                session.clear()
                expect(window.sessionStorage).to.has.lengthOf(0)
            });
            
            it('session中存在多个值：执行清空', () => {
                window.sessionStorage.setItem('a', 'a');
                window.sessionStorage.setItem('b', 'b');

                expect(window.sessionStorage).to.has.lengthOf(2)
                session.clear()
                expect(window.sessionStorage).to.has.lengthOf(0)
            });
        });
    });
});