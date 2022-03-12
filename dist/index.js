'use strict';

var chalk = require('chalk');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

class Logger {
    // info
    static info(msg) {
        const { filePos, lineNum } = this.getMsgPos(new Error());
        console.log(chalk__default["default"].greenBright.underline(filePos), chalk__default["default"].bgCyan.black(` rows: ${lineNum} `), ' ==> ', chalk__default["default"].greenBright(msg) || '');
    }
    // err
    static err(msg) {
        const { filePos, lineNum } = this.getMsgPos(new Error());
        console.error(chalk__default["default"].redBright.bold.underline(filePos), chalk__default["default"].bgCyan.black(` rows: ${lineNum} `), ' ==> ', chalk__default["default"].redBright(msg) || '');
    }
    static getMsgPos(e) {
        const arr = e.stack.split("\n")[2].split(":");
        // 文件位置
        const filePos = arr[0].slice(arr[0].indexOf('(') + 1);
        // 行号
        const lineNum = arr[1];
        return {
            filePos,
            lineNum
        };
    }
}

module.exports = Logger;
