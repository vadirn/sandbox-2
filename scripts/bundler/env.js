const { makeResolve } = require('./utils');

// project root
exports.resolve = makeResolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const watch = args.includes('--watch');

exports.watch = watch;
exports.mode = watch ? 'development' : 'production';
