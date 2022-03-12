import { xLogConfig } from './type';
declare class Logger {
    private filePath;
    private logsName;
    private isSave;
    private dependENV;
    private logsQueue;
    constructor(options: xLogConfig);
    private init;
    info(msg: any): void;
    err(msg: any): void;
    private saveLogs;
    private getMsgPos;
}
export default Logger;
//# sourceMappingURL=main.d.ts.map