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
    protected static delQueue: queue;
    constructor(options: xLogConfig);
    private init;
    info(msg: any): void;
    err(msg: any): void;
    private saveLogs;
    private getMsgPos;
    private deleteJobs;
    private deleteLogs;
}
export default Logger;
//# sourceMappingURL=main.d.ts.map