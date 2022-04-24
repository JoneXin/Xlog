/// <reference types="node" />
export declare type global = Global;
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
    logging?: boolean;
    dependENV?: boolean;
    keepDays?: number;
    maxSize?: number;
    httpModel?: boolean;
    httpConf?: httpConf;
};
export declare type httpConf = {
    aimIp: string;
    aimPort: number;
    projectName?: string;
    format?: (param: httpNewsContent) => {};
};
export declare type SaveLogsType = {
    filePos: string;
    lineNum: string;
    msg: string;
    types: string;
};
export declare type ProjectBaseInfo = {
    filePath?: string;
    logsName?: string;
    keepDays?: number;
    logging?: boolean;
    httpConf?: httpConf;
    httpModel?: boolean;
};
export declare type DelConf = {
    filePath: string;
    keepDays: number;
};
//# sourceMappingURL=type.d.ts.map