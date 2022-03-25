export enum logsType {
    Info = 'info',
    Error = 'error'
}

export type httpNewsContent = {
    time: string,
    filePath: string,
    row: number,
    logsContent: string,
    type: logsType
}

// 消息位置属性
export type msgPos = {
    filePos: string;
    lineNum: string;
}

export type xLogConfig = {
    filePath: string;
    logsName: string;
    isSave?: boolean;
    dependENV?: boolean;
    keepDays?: number;
    maxSize?: number;
    httpConf: httpConf
}

export type httpConf = {
    aimIp: string,
    aimPort: number,
    format?: (param: httpNewsContent) => {}
}

