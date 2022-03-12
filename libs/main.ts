
import chalk from 'chalk';
import { msgPos } from './type';

class Logger {

    // info
    public static info(msg: any): void {

        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.log(chalk.greenBright.underline(filePos), chalk.bgCyan.black(` rows: ${lineNum} `), ' ==> ', chalk.greenBright(msg) || '');
    }

    // err
    public static err(msg: any): void {

        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.error(chalk.redBright.bold.underline(filePos), chalk.bgCyan.black(` rows: ${lineNum} `), ' ==> ', chalk.redBright(msg) || '');
    }

    private static getMsgPos(e: Error): msgPos {

        const arr = e.stack.split("\n")[2].split(":")
        // 文件位置
        const filePos = arr[0].slice(arr[0].indexOf('(') + 1);
        // 行号
        const lineNum = arr[1];

        return {
            filePos,
            lineNum
        }
    }
}

export default Logger;