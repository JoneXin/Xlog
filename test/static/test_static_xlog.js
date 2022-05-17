const xlog = require('../../dist/main');

xlog.info('sada');
xlog.err('sada');;

xlog.err(new Error('asdasda'));

xlog.info({
    name: 1
})

// console.log(new Error('asdasda').toString());