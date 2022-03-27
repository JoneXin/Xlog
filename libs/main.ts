
import chalk from 'chalk';
import { msgPos, xLogConfig, httpConf, httpNewsContent, logsType } from './type';
import xfs from './file/xfs';
import queue from 'queue'
import schedule from 'node-schedule';
import dayjs from 'dayjs';
import os from 'os';
import axios from 'axios'

class Logger {

    private projectName = 'default';
    private category = [];
    private filePath: string;
    private logsName: string = 'default';
    // 在开发环境是否保存日志
    private isSave: boolean = false;
    // 依赖环境 去创建日志文件  development不创建  prodution 创建
    private dependENV: boolean = false;
    // logs任务队列
    private logsQueue: queue
    // 过期天数 【最小粒度，1天】 默认7天
    private keepDays: number = 7;
    // 最大大小 单位 M 默认 5g
    private maxSize: number = 5 * 1024;
    // 删除锁
    private delLock: boolean = false;
    // http 日志传输选项
    private htppConf: httpConf

    private static http
    // 删除队列，所有实例共享
    protected static delQueue: queue
    // http 消息队列
    private static httpNewsQueue: queue

    constructor(options: xLogConfig) {

        this.filePath = options.filePath;
        this.logsName = options.logsName;

        this.category = typeof options.category == 'string' ? [options.category] : options.category;
        this.projectName = options.projectName;
        this.isSave = options.isSave;
        this.dependENV = options.dependENV;
        this.keepDays = options.keepDays || this.keepDays;
        this.maxSize = options.maxSize;
        this.htppConf = options.httpConf

        this.init();
    }

    // 创建实例
    public static createLogger(config: xLogConfig): Logger {
        return new Logger(config);
    }

    // 初始化
    private init() {
        // 写日志队列
        this.logsQueue = queue({ concurrency: 1, autostart: true });

        // 删日志队列
        if (!Logger.delQueue) {
            Logger.delQueue = queue({ concurrency: 1, autostart: true });
        }

        if (!Logger.httpNewsQueue) {
            Logger.httpNewsQueue = queue({ concurrency: 1, autostart: true });
        }

        // 定时删除任务[生产环境适用]
        if (process.env.NODE_ENV == 'production') {
            schedule.scheduleJob('* * */24 * * *', () => {
                this.deleteJobs();
            });
        }

    }

    // 发送消息
    private static async transPortNews(logsContent: httpNewsContent, conf: httpConf) {

        try {
            await axios({
                url: `http://${conf.aimIp}:${conf.aimPort}/remote`,
                method: 'POST',
                data: logsContent
            })
        } catch (_) {
            return false;
        }
    }

    // info
    public info(msg: any): void {

        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.log(chalk.greenBright.underline(filePos), `【rows: ${lineNum}】`, ' ==> ', chalk.greenBright(msg) || '');

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

        // http
        if (this.htppConf) {
            Logger.httpNewsQueue.push(async cb => {

                await Logger.transPortNews({
                    logsName: `${this.logsName}_${dayjs().format('YYYY-MM-DD')}.log`,
                    filePath: filePos,
                    category: this.category,
                    projectName: this.projectName,
                    time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                    row: Number(lineNum),
                    logsContent: msg,
                    type: logsType.Info
                }, this.htppConf);
                cb();
            });
        }
    }

    // err
    public err(msg: any): void {

        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.error(chalk.redBright.bold.underline(filePos), `【rows: ${lineNum}】`, ' ==> ', chalk.redBright(msg) || '');

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

        // http
        if (this.htppConf) {
            Logger.httpNewsQueue.push(async cb => {

                await Logger.transPortNews({
                    logsName: `${this.logsName}_error_${dayjs().format('YYYY-MM-DD')}.log`,
                    filePath: filePos,
                    time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                    row: Number(lineNum),
                    logsContent: msg,
                    type: logsType.Error,
                    category: this.category,
                    projectName: this.projectName,
                }, this.htppConf);
                cb();
            });
        }
    }

    // 保存日志
    private saveLogs(filePos: string, lineNum: string, msg: string, types: string) {

        let time = dayjs().format('YYYY-MM-DD-hh:mm:ss');
        let dayTime = dayjs().format('YYYY-MM-DD');

        // format
        const logsData = `${time} ${filePos} 【第${lineNum}行】==> ${msg}`;
        let logsFilePath = '';
        // 路径转换
        if (types == 'info') {
            logsFilePath = `${this.filePath}${this.category.length ?
                ('/' + this.category.reduce((pre, cur) => pre + '/' + cur)) :
                ''}/${this.logsName}_${dayTime}.log`
        } else {
            logsFilePath = `${this.filePath}${this.category.length ?
                ('/' + this.category.reduce((pre, cur) => pre + '/' + cur)) :
                ''} /${this.logsName}_error_${dayTime}.log`;
        }

        xfs.writeFile(logsFilePath, logsData);
    }

    // 获取调用行号 和 文件位置
    private getMsgPos(e: Error): msgPos {

        let filePos = '', lineNum = '0';
        if (os.type() == 'Windows_NT') {
            const arr = e.stack.split("\n")[2].split(':');
            // 文件位置
            filePos = arr[0].slice(arr[0].length - 1) + ':' + arr[1];
            // 行号
            lineNum = arr[2];
        } else {
            const arr = e.stack.split("\n")[2].split(":");
            // 文件位置
            filePos = arr[0].slice(arr[0].indexOf('(') + 1);
            // 行号
            lineNum = arr[1];
        }

        return {
            filePos,
            lineNum
        }
    }

    // 定时删除日志脚本
    private deleteJobs(): void {

        // 加入队列 
        Logger.delQueue.push(async cb => {
            // task
            this.deleteLogs();
            cb();
        })
    }

    // 删除日志
    private deleteLogs() {

        let delTag = false;
        xfs.getFileList(this.filePath, async list => {

            // 时间筛选
            for (let i = 0; i < list.length; i++) {
                // 删除过期的logs
                const date = list[i].slice(list[i].lastIndexOf('_') + 1, list[i].lastIndexOf('.'));
                console.log(Date.now() - dayjs(date).valueOf(), this.keepDays * 24 * 60 * 60, this.keepDays);

                if (Date.now() - dayjs(date).valueOf() > this.keepDays * 24 * 60 * 60) {
                    // 过期的
                    let status = await xfs.deleteFile(`${this.filePath}/${list[i]}`);
                    if (status) {
                        console.log(`清除 ${list[i]}`);
                        delTag = true;
                    };
                }
            }

            if (!delTag) console.log('无可清除日志!');
        })
    }
}

export default Logger;