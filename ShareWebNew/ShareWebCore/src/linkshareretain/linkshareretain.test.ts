import { expect } from 'chai';
import * as sinon from 'sinon';
import { formatterName } from './linkshareretain';

describe('ShareWebCore', () => {
    describe('linkshareretain', () => {
        it('在文件名后增加rev的后缀#formatterName', () => {
            expect(formatterName('name.txt', 123)).to.equal('name123.txt');
            expect(formatterName('name.tar.gz', 123)).to.equal('name.tar123.gz');
            expect(formatterName('name', 123)).to.equal('name123');
        });
    });
});
