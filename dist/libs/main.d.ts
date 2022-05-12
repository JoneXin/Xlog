/// <reference types="node" />
import { xLogConfig, ProjectBaseInfo } from './type';
import queue from 'queue';
import paths from 'path';
declare class Logger {
    private projectName;
    private category;
    private filePath;
    private logsName;
    private logging;
    private dependENV;
    private logsQueue;
    private keepDays;
    private maxSize;
    private delLock;
    private httpModel;
    private httpConf;
    protected static delQueue: queue;
    private static httpNewsQueue;
    private static saveQueue;
    private static logsName;
    private static filePath;
    private static keepDays;
    private static logging;
    private static httpConf;
    private static httpModel;
    private static delJobs;
    private static delCorn;
    constructor(options: xLogConfig);
    static initLogger(projectConf?: ProjectBaseInfo): typeof Logger;
    static info(msgs?: any): void;
    static err(msgs?: any): void;
    static createLogger(config: xLogConfig): Logger;
    private init;
    info(msgs: any): void;
    err(msgs: any): void;
    private static transPortNews;
    private saveLogs;
    private getMsgPos;
    private static deleteJobs;
    private static deleteLogs;
}
export declare const path: paths.PlatformPath;
export declare const xlog: typeof Logger;
export {};
//# sourceMappingURL=main.d.ts.map