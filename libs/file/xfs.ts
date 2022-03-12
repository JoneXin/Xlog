
import fs from 'fs-extra';

class Xfs {

    public static async writeFile(filePath: string, data: string): Promise<boolean> {

        try {

            if (!fs.pathExistsSync(filePath)) {
                // 异步创建
                await fs.createFile(filePath);
                await fs.appendFile(filePath, data + '\n', { encoding: 'utf8' });
            }

            await fs.appendFile(filePath, data + '\n', { encoding: 'utf8' });
            return true;

        } catch (_) {
            console.log(_);
            return false;
        }
    }

    public static async deleteFile(filePath: string): Promise<boolean> {

        if (!fs.pathExistsSync(filePath)) {

            // 异步销毁
            fs.remove(filePath, err => {

                if (err) {
                    console.log(err);
                    return false;
                }

                return true;
            })
        }

        return true;
    }
}

export default Xfs;