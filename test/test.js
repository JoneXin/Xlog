
const Xlog = require('../demo/cjs/index');
const path = require('path');

const logger = new Xlog({
    fileName: path.join(__dirname, 'test'),
    logsName: 'aaa',
    keepDays: 1,
    httpConf: {
        aimIp: '127.0.0.1',
        aimPort: 4499
    }
})

logger.info('asdaksjdhasihduiasnd');
logger.err('asdaksjdhasihduiasnd');