import { msgPos, SaveLogsType, ProjectBaseInfo } from '../type';
declare class Tools {
    /**
     * 获取日志答应的位置和行号
     * @param e Error
     * @returns 文件位置 行号
     */
    static getMsgPos(e: Error): msgPos;
    /**
     * 保存日志
     * @param logsContent 日志内容
     * @param projectConf 项目配置
     */
    static saveLogs(logsContent: SaveLogsType, projectConf: ProjectBaseInfo): void;
}
export default Tools;
//# sourceMappingURL=tool.d.ts.map