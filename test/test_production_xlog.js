process.env.NODE_ENV = 'production';

const {xlog, path} = require('../dist/main');
xlog.initLogger({
    delCorn: '*/1 * * * * *'
})
xlog.info('sada');