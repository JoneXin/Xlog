declare class Xfs {
    static writeFile(filePath: string, data: string): Promise<boolean>;
    static deleteFile(filePath: string): Promise<boolean>;
    static getFileList(filePath: string, callback: any): void;
}
export default Xfs;
//# sourceMappingURL=xfs.d.ts.map