var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: ['./src/**', './lib/**', './node_modules/**', './*'],
    platforms: ['win'],
});
 
//Log stuff you want 
 
nw.on('log',  console.log);
 
// Build returns a promise 
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});