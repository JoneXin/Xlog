const Xlog = require('./cjs/index');
const path = require('path');

let xlog = new Xlog({
    filePath: path.join(__dirname, 'logs'),
    logsName: 'xinxin',
    isSave: true,
    dependENV: true
});


xlog.info('asdada');
xlog.err('asdada')