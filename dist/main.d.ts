import { xLogConfig } from './type';
import queue from 'queue';
declare class Logger {
    private filePath;
    private logsName;
    private isSave;
    private dependENV;
    private logsQueue;
    private keepDays;
    private maxSize;
    private delLock;
    private htppConf;
    private static http;
    protected static delQueue: queue;
    private static httpNewsQueue;
    constructor(options: xLogConfig);
    static createLogger(config: xLogConfig): Logger;
    private init;
    private static transPortNews;
    info(msg: any): void;
    err(msg: any): void;
    private saveLogs;
    private getMsgPos;
    private deleteJobs;
    private deleteLogs;
}
export default Logger;
//# sourceMappingURL=main.d.ts.map