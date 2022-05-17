import os from 'os';
import { msgPos, SaveLogsType, ProjectBaseInfo} from '../type';
import dayjs from 'dayjs';
import xfs from '../file/xfs';
import {resolve} from 'path';

class Tools {

    /**
     * 获取日志答应的位置和行号
     * @param e Error
     * @returns 文件位置 行号
     */
    public static getMsgPos(e: Error): msgPos {

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

    /**
     * 保存日志
     * @param logsContent 日志内容
     * @param projectConf 项目配置
     */
    public static saveLogs(logsContent: SaveLogsType, projectConf: ProjectBaseInfo) {

        let time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        let dayTime = dayjs().format('YYYY-MM-DD');

        // format
        const logsData = `${time} ${logsContent.filePos} 【第${logsContent.lineNum}行】==> ${logsContent.msg}`;
        let logsFilePath, filePath, logsName;
        filePath = projectConf.filePath || resolve(__dirname, './logs');
        logsName = projectConf.logsName || 'default';
        
        // 路径转换
        if (logsContent.types == 'info') {
            logsFilePath = `${filePath}/${logsName}_${dayTime}.log`
        } else {
            logsFilePath = `${filePath}/${logsName}_error_${dayTime}.log`;
        }

        try {
            xfs.writeFile(logsFilePath, logsData);
        } catch (_) {
            console.log(_);
        }
    }
}

export default Tools;