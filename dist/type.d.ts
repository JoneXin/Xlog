export declare enum logsType {
    Info = "info",
    Error = "error"
}
export declare type httpNewsContent = {
    time: string;
    filePath: string;
    row: number;
    logsContent: string;
    type: logsType;
    category?: string | string[];
    projectName: string;
    logsName: string;
};
export declare type msgPos = {
    filePos: string;
    lineNum: string;
};
export declare type xLogConfig = {
    category?: string | string[];
    projectName: string;
    filePath: string;
    logsName: string;
    isSave?: boolean;
    dependENV?: boolean;
    keepDays?: number;
    maxSize?: number;
    httpConf: httpConf;
};
export declare type httpConf = {
    aimIp: string;
    aimPort: number;
    format?: (param: httpNewsContent) => {};
};
//# sourceMappingURL=type.d.ts.map