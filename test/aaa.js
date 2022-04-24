const {Logger, path} = require('../dist/main');

const logger = new Logger({ 
    projectName: 'rtp_line_et', 
    filePath: path.join(__dirname, './logs'),
    category: ['piantie', 'piantiehou'],
    logsName: 'piantiehou',
    logging: true
});

logger.info('asdjhkahsdkanjksd')