# Xlog
a logs tool for node
```js
const Xlog = require('./cjs/index');
const path = require('path');

let xlog = new Xlog({
    filePath: path.join(__dirname, 'logs'), // you can divided logs path for diffrent instance
    logsName: 'xinxin', // logs fileName  lastName is xinxin_2021-2-4.log and xinxin_error_2021-2-4
    isSave: true, // is save logs to file
    dependENV: true, // save logs to file depend env [production -> save]
    keepDays: 7 // default 7days  enable for production env
});


xlog.info('asdada'); // info 
xlog.err('asdada') //error
```
