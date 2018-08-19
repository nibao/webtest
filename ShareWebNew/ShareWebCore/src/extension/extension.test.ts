import { expect } from 'chai';
import { EXTENSIONS, serializeName, splitName, findType, findOWASType, findOWASEditType, findPictrueType, OWASSupported } from './extension';

declare const { describe, it };

describe('ShareWebCore', () => {
    describe('extension', () => {


        describe('文件扩展类型导出#EXTENSIONS', () => {

            it('测试EXTENSIONS是否暴露，并且包含必须的属性', () => {
                expect(EXTENSIONS).to.be.a('object').that.have.all.keys('WORD', 'EXCEL', 'PPT', 'PDF', 'TXT', 'IMG', 'ARCHIVE', 'VIDEO', 'AUDIO', 'EXE', 'CAD', 'PSD', 'VISIO', 'HTML');
            });

        });


        describe('序列化文件名#serializeName', () => {

            it('传入空字符串：返回空字符串', () => {
                expect(serializeName('')).to.be.a('string').that.be.empty;
            });

            it('传入不带.的字符串：返回".[传入字符串]"', () => {
                expect(serializeName('name')).to.equal('.name');
            });

            it('传入带一个.的字符串：返回".[字符串中最后一个.之后的字符]"', () => {
                expect(serializeName('a.name')).to.equal('.name');
            });

            it('传入带一个.的字符串：返回".[字符串中最后一个.之后的字符]"', () => {
                expect(serializeName('a.name')).to.equal('.name');
            });

            it('传入带多个.的文件名：返回".[字符串中最后一个.之后的字符]"', () => {
                expect(serializeName('a.b.c.name')).to.equal('.name');
            })

        })


        describe('分割文件名与后缀#splitName', () => {

            it('传入空文件全名：返回["",""]', () => {
                expect(splitName('')).to.deep.equal(['', '']);
            });

            it('传入不带后缀的文件名:返回[name,""]', () => {
                expect(splitName('abc')).to.deep.equal(['abc', '']);
            });

            it('传入完整的文件名:返回[name,ext]', () => {
                expect(splitName('abc.txt')).to.deep.equal(['abc', 'txt']);
            });

        });


        describe('测试返回正确的文档类型#findType', () => {

            it('传入空字符串或未知文件类型：返回undefined', () => {
                expect(findType('')).to.be.undefined;
                expect(findType('ext')).to.be.undefined;
                expect(findType('.ext')).to.be.undefined;
                expect(findType('a.ext')).to.be.undefined;
                expect(findType('a.b.ext')).to.be.undefined;
            });

            it('传入已知文件类型：返回正确的文件类型', () => {
                expect(findType('doc')).to.equal('WORD');
                expect(findType('.xlsx')).to.equal('EXCEL');
                expect(findType('a.pptx')).to.equal('PPT');
                expect(findType('a.b.jpg')).to.equal('IMG');
            });

        });


        describe('获取OWAS文档类型#findOWASType', () => {

            it('传入空字符串或非文件OWAS文档类型：返回undefined', () => {
                expect(findOWASType('')).to.be.undefined;
                expect(findOWASType('txt')).to.be.undefined;
                expect(findOWASType('a.txt')).to.be.undefined;
                expect(findOWASType('a.b.txt')).to.be.undefined;

            });

            it('传入正确的OWAS文档类型：返回正确的OWAS文档类型', () => {
                expect(findOWASType('doc')).to.equal('WORD');
                expect(findOWASType('.doc')).to.equal('WORD');
                expect(findOWASType('a.doc')).to.equal('WORD');
                expect(findOWASType('a.b.doc')).to.equal('WORD');
            });

        });


        describe('获取OWAS支持编辑的类型#findOWASEditType', () => {
            it('传入空字符串或OWAS不支持编辑的格式：返回undefined', () => {
                expect(findOWASEditType('')).to.be.undefined;
                expect(findOWASEditType('a.txt')).to.be.undefined;
                expect(findOWASEditType('a.jpg')).to.be.undefined;
                expect(findOWASEditType('a.doc')).to.be.undefined;
            });

            it('传入OWAS支持编辑的格式：返回undefined', () => {
                expect(findOWASEditType('docx')).to.equal('WORD');
                expect(findOWASEditType('a.xlsx')).to.equal('EXCEL');
                expect(findOWASEditType('a.b.pptx')).to.equal('PPT');
            });


        });


        describe('微信企业号支持图片类型#findPictrueType', () => {

            it('传入空字符串或微信企业号不支持的图片类型:返回undefined', () => {
                expect(findPictrueType('')).to.be.undefined;
                expect(findPictrueType('psd')).to.be.undefined;
                expect(findPictrueType('.psd')).to.be.undefined;
                expect(findPictrueType('a.psd')).to.be.undefined;
            });

            it('传入微信企业号支持的图片类型:返回IMG', () => {
                expect(findPictrueType('jpg')).to.equal('IMG');
                expect(findPictrueType('.jpg')).to.equal('IMG');
                expect(findPictrueType('a.jpg')).to.equal('IMG');
                expect(findPictrueType('a.b.jpg')).to.equal('IMG');

            });

        });

        describe('是否是OWAS支持的文件类型#OWASSupported', () => {

            it('传入空字符串或OWAS支持的文件类型:返回false', () => {
                expect(OWASSupported('')).to.be.false;
                expect(OWASSupported('psd')).to.be.false;
                expect(OWASSupported('.psd')).to.be.false;
                expect(OWASSupported('a.psd')).to.be.false;
            });

            it('传入OWAS支持的文件类型：返回true', () => {
                expect(OWASSupported('doc')).to.be.true;
                expect(OWASSupported('.doc')).to.be.true;
                expect(OWASSupported('a.doc')).to.be.true;
                expect(OWASSupported('a.b.doc')).to.be.true;
            });

            it('传入OWAS支持编辑的文件类型并且editable为true：返回ture', () => {
                expect(OWASSupported('.docx', { editable: true })).to.be.true;
            });

            it('传入OWAS不支持编辑的文件类型并且editable为true：返回false', () => {
                expect(OWASSupported('.doc', { editable: true })).to.be.false;
            });

        });


    });
})