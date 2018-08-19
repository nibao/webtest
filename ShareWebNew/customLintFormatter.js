'use strict';

const ts = require('typescript');
const Lint = require('tslint/lib/lint');

class Formatter extends Lint.Formatters.AbstractFormatter {
    format(failures) {
        return failures.map(function (failure) {
            var fileName = failure.getFileName();
            var failureString = failure.getFailure();
            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var positionTuple = `(${lineAndCharacter.line + 1},${lineAndCharacter.character + 1})`;
            return `${fileName}${positionTuple}: warning TSLint: ${failureString}`
        }).join('\n') + '\n';
    }
}

exports.Formatter = Formatter;