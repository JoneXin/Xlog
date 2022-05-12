const {xlog, path} = require('../dist/main');

const logger = new xlog({
    filePath: path.resolve(__dirname, './logs_a'),
    logsName: 'c',
    category: ['as', 'v'],
    projectName: 'loggger_test_1',
    logging: true
});
const logger1 = new xlog({
    filePath: path.resolve(__dirname, './logs_b'),
    logsName: 'c',
    category: ['asd', 'vsad'],
    projectName: 'loggger_test_2',
    logging: true
});


setInterval(() => {
    logger.info('asdasda');
}, 1000)

setInterval(() => {
    logger1.info('asdasda');
}, 1000)