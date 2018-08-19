import { expect } from 'chai';
import { getFormData, JSONify } from './form';

describe('ShareWebUtil', () => {
    describe('form', () => {
        describe('从表单中提取键值对', () => {

            it('单个输入标签,获取到正确的键值对', () => {
                const form = document.createElement('form');
                const input = document.createElement('input');
                input.setAttribute('name', 'userName');
                input.setAttribute('value', 'test');
                form.appendChild(input);
                expect(getFormData(form)).to.deep.equal({ userName: 'test' });
            });
            
            it('多个输入标签,获取到正确的键值对', () => {
                const form = document.createElement('form');
                const input1 = document.createElement('input');
                input1.setAttribute('name', 'userName');
                input1.setAttribute('value', 'test');
                const input2 = document.createElement('input');
                input2.setAttribute('name', 'age');
                input2.setAttribute('value', '18');
                form.appendChild(input1);
                form.appendChild(input2);
                expect(getFormData(form)).to.deep.equal({ userName: 'test', age: '18' });
            });
        });
    })
})