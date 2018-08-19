import { expect } from 'chai'
import * as sinon from 'sinon'
import * as config from '../config/config'
import * as extension from '../extension/extension'
import { canOWASPreview, canOWASEdit } from './owas'
import { sandboxStub } from '../../libs/test-helper'

describe('ShareWebCore', () => {
    describe('owas', () => {
        const sandbox = sinon.createSandbox()
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: config,
                    moduleProp: ['getOEMConfig']
                },
                {
                    moduleObj: extension,
                    moduleProp: ['OWASSupported']
                }
            ])
        });

        afterEach('restore', () => {
            sandbox.restore();
        })
        
        describe('获取OWAS地址#getOWASURL', () => {
            describe('method为edit', () => {
                it('外链，无修改权限，抛错', () => {
                    
                })

                it('文件无法编辑，抛错', () => {
                    
                })

                it('文件被锁定，抛错', () => {
                    
                })
            })  
        })

        describe('判断是否支持owa预览#canOWASPreview', () => {
            it('未配置owasurl，返回false', async () => {
                config.getOEMConfig.resolves({ wopiurl: 'wopiurl' })
                expect(await canOWASPreview({ name: 'a.doc' })).to.be.false
            });

            it('未配置wopiurl,返回false', async () => {
                config.getOEMConfig.resolves({ owasurl: 'owasurl' })
                expect(await canOWASPreview({ name: 'a.doc' })).to.be.false
            });

            it('配置了owasurl wopiurl,但不是OWAS支持的文件类型，返回false', async () => {
                config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                extension.OWASSupported.returns(false)
                expect(await canOWASPreview({ name: 'a.abc' })).to.be.false
            });

            it('配置了owasurl wopiurl，并且是OWAS支持的文件类型，返回ture', async () => {
                config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                extension.OWASSupported.returns(true)
                expect(await canOWASPreview({ name: 'a.doc' })).to.be.true
            });
        });

        describe('判断是否支持owa编辑#canOWASEdit', () => {
            it('未配置owasurl，返回false', async () => {
                config.getOEMConfig.resolves({ wopiurl: 'wopiurl' })
                expect(await canOWASEdit({ name: 'a.doc' })).to.be.false
            });

            it('未配置wopiurl,返回false', async () => {
                config.getOEMConfig.resolves({ owasurl: 'owasurl' })
                expect(await canOWASEdit({ name: 'a.doc' })).to.be.false
            });

            it('配置了owasurl wopiurl,但不是OWAS支持的文件类型，返回false', async () => {
                config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                extension.OWASSupported.returns(false)
                expect(await canOWASEdit({ name: 'a.abc' })).to.be.false
            });

            it('配置了owasurl wopiurl，并且是OWAS支持的文件类型，返回ture', async () => {
                config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                extension.OWASSupported.returns(true)
                expect(await canOWASEdit({ name: 'a.doc' })).to.be.true
            });
        });


    })
})