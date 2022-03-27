
const Xlog = require('../demo/cjs/index');
const path = require('path');

const logger = new Xlog({
    projectName: 'Xlog',
    filePath: path.join(__dirname, '../logs'),
    category: 'test1',
    logsName: 'asmdkla',
    keepDays: 1,
    isSave: true,
    httpConf: {
        aimIp: '127.0.0.1',
        aimPort: 4499
    }
})

setInterval(() => {
    logger.info('找sadasdasdasdasdasd萨达hasbdhuabu阿丝丝带吧 阿萨德啊啊点');
    logger.info('找sadasdasdasdasdasd萨达hasbdhuabu阿丝丝带吧 阿萨德啊啊点');
    logger.info('找sadasdasdasdasdasd萨达hasbdhuabu阿丝丝带吧 阿萨德啊啊点');
    logger.info('找sadasdasdasdasdasd萨达hasbdhuabu阿丝丝带吧 阿萨德啊啊点');
    logger.info('找sadasdasdasdasdasd萨达hasbdhuabu阿丝丝带吧 阿萨德啊啊点');
    logger.info('找sadasdasdasdasdasd萨达hasbdhuabu阿丝丝带吧 阿萨德啊啊点');
    logger.err('错误啊平时asdasd 的吗啦吗');
    logger.err('错误啊平时asdasd 的吗啦吗');
    logger.err('错误啊平时asdasd 的吗啦吗');
    logger.err('错误啊平时asdasd 的吗啦吗');
    logger.err('错误啊平时asdasd 的吗啦吗');
}, 1000)