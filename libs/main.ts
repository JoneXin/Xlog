
import chalk from 'chalk';
import { msgPos, xLogConfig } from './type';
import xfs from './file/xfs';
import dayjs from 'dayjs'
import queue from 'queue'

class Logger {

    private filePath: string;
    private logsName: string = 'default';
    // 在开发环境是否保存日志
    private isSave: boolean = false;
    // 依赖环境 去创建日志文件  development不创建  prodution 创建
    private dependENV: boolean = false;
    // logs任务队列
    private logsQueue: queue

    constructor(options: xLogConfig) {

        this.filePath = options.filePath;
        this.logsName = options.logsName;
        this.isSave = options.isSave;
        this.dependENV = options.dependENV;

        this.init();
    }
    // 初始化
    private init() {
        // 日志队列
        this.logsQueue = queue({ concurrency: 1, autostart: true });
    }

    // info
    public info(msg: any): void {

        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.log(chalk.greenBright.underline(filePos), chalk.bgCyan.black(` rows: ${lineNum} `), ' ==> ', chalk.greenBright(msg) || '');

        // 根据环境自动监测日志是否保存
        if (this.dependENV) {
            process.env.NODE_ENV == 'production' ? this.logsQueue.push(async cb => {
                await this.saveLogs(filePos, lineNum, msg, 'info');
                cb();
            }) : '';
        }

        // 开发环境保存日志
        if (this.isSave) {
            this.saveLogs(filePos, lineNum, msg, 'info');
        }
    }

    // err
    public err(msg: any): void {

        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.error(chalk.redBright.bold.underline(filePos), chalk.bgYellow.black(` rows: ${lineNum} `), ' ==> ', chalk.redBright(msg) || '');

        // 根据环境自动监测日志是否保存
        if (this.dependENV) {
            process.env.NODE_ENV == 'production' ? this.logsQueue.push(async cb => {
                await this.saveLogs(filePos, lineNum, msg, 'err');
                cb();
            }) : '';
        }

        // 开发环境保存日志
        if (this.isSave) {
            this.saveLogs(filePos, lineNum, msg, 'err');
        }
    }

    // 保存日志
    private saveLogs(filePos: string, lineNum: string, msg: string, types: string) {

        let time = dayjs().format('YYYY-MM-DD-hh:mm:ss');
        // format
        const logsData = `${time} ${filePos} 【第${lineNum}行】==> ${msg}`;
        // 路径转换
        const logsFilePath = types == 'info' ? `${this.filePath}/${this.logsName}.log` : `${this.filePath}/${this.logsName}_error.log`;

        xfs.writeFile(logsFilePath, logsData);
    }

    private getMsgPos(e: Error): msgPos {

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