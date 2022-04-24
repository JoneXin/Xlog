# Xlog
a logs tool for node
```js
// 全局配置 基本操作
const {Logger : log, path} = require('xlog');
Logger.initLogger();
// 默认全局属性
logger.info(1); // default name // X:\my-open-project\Xlog\test\test1.js 【rows: 2】  ==>  1
log.info(1); // X:\my-open-project\Xlog\test\test1.js 【rows: 3】  ==>  1

// 自定义配置项
log.initLogger({
    logsName: 'trrrr', //日志名 || default
    filePath: path.join(__dirname, './logs'), // 日志文件存储路径 || resove() + ./logs
    keepDays: 1, // 日志保存天数 || 3
    httpModel: true, // 是启用http传输 || false
    // http目标端点配置
    httpConf: {
        projectName: 'xlog',
        aimIp: '127.0.0.1',
        aimPort: 4499
    },
    logging: true // 是否在开发环境 输出日志文件 || 默认 false
});

// 实例化属性
const a = new Logger({
    filePath: path.join(__dirname, './lggg'),
    logsName: 'adadad',
    projectName: 'ttt',
    logging: true,
    keepDays: 1, // 日志保存天数 || 3
    httpModel: true, // 是启用http传输 || false
    // http目标端点配置
    httpConf: {
        projectName: 'xlogss',
        aimIp: '127.0.0.1',
        aimPort: 4499
    },
})



logger.info([1,2],'asdasdada '); // default name // X:\my-open-project\Xlog\test\test1.js 【rows: 2】  ==>  1
log.err(1,'hasjdbjhasbnhjda'); // X:\my-open-project\Xlog\test\test1.js 【rows: 3】  ==>  1
a.info([1,2],'asdasdada '); // default name // X:\my-open-project\Xlog\test\test1.js 【rows: 2】  ==>  1
a.err(1,'hasjdbjhasbnhjda'); // X:\my-open-project\Xlog\test\test1.js 【rows: 3】  ==>  1

```
