
const Xlog = require('../demo/cjs/index');
const path = require('path');

const logger = new Xlog({
    projectName: 'Xlog',
    filePath: path.join(__dirname, '../logs'),
    category: 'test',
    logsName: 'aaa',
    keepDays: 1,
    isSave: true,
    httpConf: {
        aimIp: '127.0.0.1',
        aimPort: 4499
    }
})

const logger1 = new Xlog({
    projectName: 'Xlog',
    filePath: path.join(__dirname, '../logs'),
    category: ['piantie', 'piantieqian'],
    logsName: 'aaa',
    keepDays: 1,
    isSave: true,
    httpConf: {
        aimIp: '127.0.0.1',
        aimPort: 4499
    }
})

let i = 0;
logger1.info('asdasda')
logger1.err('哎asdas呀asd')

setInterval(() => {
    // logger.info('找sad阿四');
    // logger.info('找sad阿四');
    // logger.info('找sad阿四');
    // logger.info('找sad阿四');
    // logger.info('找sad阿四');
    // logger.info('找sad阿四');
    // logger.info('找sad阿四');
    // logger.err('asdaksjdhasihduiasnd');
    logger1.err(`[{a: 1}, {b: 2}]${i}`)
}, 1000)