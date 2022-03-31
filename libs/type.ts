export type global = Global

export enum logsType {
    Info = 'info',
    Error = 'error'
}

export type httpNewsContent = {
    time: string,
    filePath: string,
    row: number,
    logsContent: string,
    type: logsType;
    category?: string | string[];
    projectName: string;
    logsName: string;
}

// 消息位置属性
export type msgPos = {
    filePos: string;
    lineNum: string;
}

export type xLogConfig = {
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
}

export type httpConf = {
    aimIp: string,
    aimPort: number,
    projectName?: string;
    format?: (param: httpNewsContent) => {}
}

export type SaveLogsType = {
    filePos: string, 
    lineNum: string, 
    msg: string, 
    types: string
}

export type ProjectBaseInfo = {
    filePath?: string; 
    logsName?: string;
    keepDays?: number;
    logging?: boolean;
    httpConf?: httpConf;
    httpModel?: boolean;
}

export type DelConf = {
    filePath: string; 
    keepDays: number;
}

