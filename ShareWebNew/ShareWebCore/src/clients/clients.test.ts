import { expect } from 'chai';
import {
    ClientTypes,
    clientName,
    WindowTitle,
    buildClientList,
    getOffice,
} from './clients';
import __ from './locale';

describe('ShareWebCore', () => {
    describe('clients', () => {

        it('导出客户端下载类型#ClientTypes', () => {
            expect(ClientTypes.WIN_32).to.equal(0)
            expect(ClientTypes.WIN_64).to.equal(1)
            expect(ClientTypes.ANDROID).to.equal(2)
            expect(ClientTypes.MAC).to.equal(3)
            expect(ClientTypes.WIN_32_ADVANCED).to.equal(4)
            expect(ClientTypes.WIN_64_ADVANCED).to.equal(5)
            expect(ClientTypes.IOS).to.equal(6)
            expect(ClientTypes.OFFICE_PLUGIN).to.equal(7)
        })

        it('获取windows客户端悬浮内容#WindowTitle', () => {
            expect(WindowTitle[ClientTypes.WIN_32]).to.equal(__('推荐配置 CPU i3，内存2GB，操作系统XP/win7/win8/win10及以上 使用'))
            expect(WindowTitle[ClientTypes.WIN_64]).to.equal(__('推荐配置 CPU i3，内存2GB，操作系统XP/win7/win8/win10及以上 使用'))
            expect(WindowTitle[ClientTypes.WIN_32_ADVANCED]).to.equal(__('推荐配置 CPU i3，内存4GB，操作系统win7/win8/win10及以上 使用'))
            expect(WindowTitle[ClientTypes.WIN_64_ADVANCED]).to.equal(__('推荐配置 CPU i3，内存4GB，操作系统win7/win8/win10及以上 使用'))
        })

        describe('get客户端名#clientName', () => {
            it('传入正确的客户端类型：返回正确的客户端名称', () => {
                expect(clientName(ClientTypes.WIN_32)).to.equal(__('Windows Standard'))
                expect(clientName(ClientTypes.WIN_64)).to.equal(__('Windows Standard'))
                expect(clientName(ClientTypes.MAC)).to.equal(__('Mac'))
                expect(clientName(ClientTypes.ANDROID)).to.equal(__('Android'))
                expect(clientName(ClientTypes.IOS)).to.equal(__('iOS'))
                expect(clientName(ClientTypes.OFFICE_PLUGIN)).to.equal(__('Office插件'))
                expect(clientName(ClientTypes.WIN_32_ADVANCED)).to.equal(__('Windows Advanced'))
                expect(clientName(ClientTypes.WIN_64_ADVANCED)).to.equal(__('Windows Advanced'))
            });
        });


        describe('获取客户端配置#buildClientList', () => {
            it('正确获取到客户端配置（缓存原因，暂无法测试）')
        });

        describe('获取office插件地址', () => {
            afterEach('还原window.hash', () => {
                window.location.hash = '';
            })

            it('当前语言环境为简体中文：返回中文版的office插件地址下载路径', () => {
                window.location.hash = 'lang=zh-cn';
                expect(getOffice()).to.be.equal('/download/AnyShare_for_Office_CN.exe')
            });

            it('当前语言环境为繁体中文：返回中文版的office插件地址下载路径', () => {
                window.location.hash = 'lang=zh-tw';
                expect(getOffice()).to.be.equal('/download/AnyShare_for_Office_CN.exe')
            });

            it('当前语言环境为英语：返回英文版的office插件地址下载路径', () => {
                window.location.hash = 'lang=en-us';
                expect(getOffice()).to.be.equal('/download/AnyShare_for_Office_EN.exe')
            });
        });
    })
})