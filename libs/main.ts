
import chalk from 'chalk';
import { msgPos, xLogConfig, httpConf, httpNewsContent, logsType, ProjectBaseInfo, DelConf, global} from './type';
import xfs from './file/xfs';
import queue from 'queue';
import schedule from 'node-schedule';
import dayjs from 'dayjs';
import os from 'os';
import axios from 'axios';
import Tools from './utils/tool';
import { resolve } from 'path';
import paths from 'path';
class Logger {

    public static path = paths;
    public static xlog = Logger;

    private projectName = 'default';
    private category: string [] = [];
    private filePath: string;
    private logsName: string = 'default';
    // 在开发环境是否保存日志
    private logging: boolean = false;
    // 依赖环境 去创建日志文件  development不创建  prodution 创建
    private dependENV: boolean = false;
    // logs任务队列
    private logsQueue: queue;
    // 过期天数 【最小粒度，1天】 默认3天
    private keepDays: number = 3;
    // 最大大小 单位 M 默认 5g
    private maxSize: number = 5 * 1024;
    // 删除锁
    private delLock: boolean = false;
    private httpModel: boolean;
    // http 日志传输选项
    private httpConf: httpConf;
    // 删除队列，所有实例共享
    protected static delQueue: queue;
    // http 消息队列
    private static httpNewsQueue: queue;
    // 保存日志队列
    private static saveQueue: queue;
    private static logsName: string;
    private static filePath: string;
    private static keepDays: number = 3; // 默认3 天
    private static logging: boolean; // 是否输出日志文件【生产环境自动 输出， 此配置主要试用于开发环境需要写日志文件的需求】
    private static httpConf: httpConf;
    private static httpModel: boolean;
    private static delJobs: any = null; // 定时删除任务id
    private static delCorn: string = '0 0 */1 * * *'; // 每小时执行一次

    constructor(options: xLogConfig) {

        this.filePath = options.filePath;
        this.logsName = options.logsName;

        this.category = typeof options.category == 'string' ? [options.category] : options.category;
        this.projectName = options.projectName;
        this.logging = options.logging;
        this.dependENV = options.dependENV;
        this.keepDays = options.keepDays || this.keepDays;
        this.maxSize = options.maxSize;
        this.httpModel = options.httpModel || false;
        this.httpConf = options.httpConf;

        this.init();
    }

    public static initLogger(projectConf?: ProjectBaseInfo) {

        Logger.filePath = projectConf?.filePath || `${resolve()}/logs`;
        Logger.logsName = projectConf?.logsName || 'default';
        Logger.keepDays = projectConf?.keepDays || Logger.keepDays;
        Logger.logging = projectConf?.logging || false;
        Logger.httpConf = projectConf?.httpConf || { aimIp: '127.0.0.1', aimPort: 4499, projectName: 'default' };
        Logger.httpModel = projectConf?.httpModel || false;

        // 实例化 写日志队列
        if (!Logger.saveQueue) {
            Logger.saveQueue = queue({ concurrency: 1, autostart: true });
        }

        // 删日志队列
        if (!Logger.delQueue) {
            Logger.delQueue = queue({ concurrency: 1, autostart: true });
        }

        if (!Logger.httpNewsQueue) {
            Logger.httpNewsQueue = queue({ concurrency: 1, autostart: true });
        }

        // 定时删除任务[生产环境适用]
        if (process.env.NODE_ENV == 'production' && !Logger.delJobs) {
            Logger.delJobs = schedule.scheduleJob(Logger.delCorn, () => {
                Logger.deleteJobs();
            });
        }

        // 配置全局默认日志对象
        global.logger = Logger;

        return Logger;
    }

    public static info(msgs?: any): void {

        const msg = [...arguments];
        const { filePos, lineNum } = Tools.getMsgPos(new Error());
        console.log(chalk.greenBright.underline(filePos), `【rows: ${lineNum}】`, ' ==> ', chalk.greenBright(JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1)) || '');

        if (process.env.NODE_ENV == 'production' || Logger.logging) {
            Logger.saveQueue.push(async cb => {
                await Tools.saveLogs({ filePos, lineNum, types: 'info', msg: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) }, { filePath: Logger.filePath, logsName: Logger.logsName });
                cb();
            });
        }

        if (Logger.httpModel) {
            Logger.httpNewsQueue.push(async cb => {
                await Logger.transPortNews({
                    logsName: `${Logger.logsName}_${dayjs().format('YYYY-MM-DD')}.log`,
                    filePath: filePos,
                    category: [],
                    projectName: Logger.httpConf.projectName,
                    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    row: Number(lineNum),
                    logsContent: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) || '',
                    type: logsType.Info
                }, Logger.httpConf);
                cb();
            });
        }
    }

    // 静态 err
    public static err(msgs?: any): void {

        const msg = [...arguments];
        const { filePos, lineNum } = Tools.getMsgPos(new Error());

        console.error(chalk.redBright.bold.underline(filePos), `【rows: ${lineNum}】`, ' ==> ', chalk.greenBright(JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1)) || '');

        if (process.env.NODE_ENV == 'production' || Logger.logging) {
            Logger.saveQueue.push(async cb => {
                await Tools.saveLogs({ filePos, lineNum, types: 'error', msg: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) }, { filePath: Logger.filePath, logsName: Logger.logsName });
                cb();
            })
        }

         if (Logger.httpModel) {
            Logger.httpNewsQueue.push(async cb => {
                await Logger.transPortNews({
                    logsName: `${Logger.logsName}_error_${dayjs().format('YYYY-MM-DD')}.log`,
                    filePath: filePos,
                    category: [],
                    projectName: Logger.httpConf.projectName,
                    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    row: Number(lineNum),
                    logsContent: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) || '',
                    type: logsType.Error
                }, Logger.httpConf);
                cb();
            });
        }
    }

    // 创建实例
    public static createLogger(config: xLogConfig): Logger {
        return new Logger(config);
    }

    // 初始化
    private init() {
        // 写日志队列
        this.logsQueue = queue({ concurrency: 1, autostart: true });
        // 定时删除任务[生产环境适用]
        if (process.env.NODE_ENV == 'production' && !Logger.delJobs) {
            Logger.delJobs = schedule.scheduleJob(Logger.delCorn, () => {
                Logger.deleteJobs();
            });
        }
    }

    // 实例 info
    public info(msgs: any): void {
        
        const msg = [...arguments];
        const { filePos, lineNum } = this.getMsgPos(new Error());

        console.log(chalk.greenBright.underline(filePos), `【rows: ${lineNum}】`, ' ==> ', chalk.greenBright(JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1)) || '');

        if (process.env.NODE_ENV == 'production' || this.logging) {
            this.logsQueue.push(async cb => {
                await Tools.saveLogs({ filePos, lineNum, types: 'info', msg: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) }, { filePath: paths.join(this.filePath, ...this.category), logsName: this.logsName });
                cb();
            });
        }

        // http
        if (this.httpModel) {
            Logger.httpNewsQueue.push(async cb => {

                await Logger.transPortNews({
                    logsName: `${this.logsName}_error_${dayjs().format('YYYY-MM-DD')}.log`,
                    filePath: filePos,
                    time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                    row: Number(lineNum),
                    logsContent: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) || '',
                    type: logsType.Info,
                    category: this.category || [],
                    projectName: this.projectName,
                }, this.httpConf);
                cb();
            });
        }
    }

    // 实例 err
    public err(msgs: any): void {

        const msg = [...arguments];
        const { filePos, lineNum } = this.getMsgPos(new Error());
        console.error(chalk.redBright.bold.underline(filePos), `【rows: ${lineNum}】`, ' ==> ', chalk.greenBright(JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1)) || '');
        // 输出到日志文件
        if (process.env.NODE_ENV == 'production' || this.logging) {
            this.logsQueue.push(async cb => {
                await Tools.saveLogs({ filePos, lineNum, types: 'error', msg: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) }, { filePath: paths.join(this.filePath, ...this.category), logsName: this.logsName });
                cb();
            })
        }
        // http
        if (this.httpModel) {
            Logger.httpNewsQueue.push(async cb => {

                await Logger.transPortNews({
                    logsName: `${this.logsName}_error_${dayjs().format('YYYY-MM-DD')}.log`,
                    filePath: filePos,
                    time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                    row: Number(lineNum),
                    logsContent: JSON.stringify(msg).slice(1, JSON.stringify(msg).length - 1) || '',
                    type: logsType.Error,
                    category: this.category || [],
                    projectName: this.projectName,
                }, this.httpConf);
                cb();
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
    private static deleteJobs(): void {

        // 加入队列 
        Logger.delQueue.push(async cb => {
            // task
            Logger.deleteLogs();
            cb();
        })
    }

    // 删除日志
    private static deleteLogs(delConf?: DelConf) {

        Logger.info('开始删除日志');

        let delTag = false;
        let keepDays = delConf?.keepDays || Logger.keepDays;
        let filePath = delConf?.filePath || Logger.filePath;
        // 删除过期的logs
        xfs.getFileList(filePath, async list => {

            for (let i = 0; i < list.length; i++) {
                const date = list[i].slice(list[i].lastIndexOf('_') + 1, list[i].lastIndexOf('.'));
                console.log(Date.now() , dayjs(date).valueOf(), keepDays * 24 * 60 * 60 * 1000, keepDays);

                if (Date.now() - dayjs(date).valueOf() > keepDays * 24 * 60 * 60 * 1000) {
                    // 过期的
                    let status = await xfs.deleteFile(`${filePath}/${list[i]}`);
                    if (status) {
                        Logger.info(`清除 ${list[i]}`);
                        delTag = true;
                    };
                }
            }

            if (!delTag) Logger.info('无可清除日志!');
        })
    }
}


module.exports = Logger.initLogger();
// Allow use of default import syntax in TypeScript
module.exports.default =  Logger.initLogger();