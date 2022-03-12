

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
}