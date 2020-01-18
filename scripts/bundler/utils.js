const fs = require('fs-extra');
const path = require('path');

const previousContents = new Map();

exports.writeIfChanged = (file, code) => {
  if (code !== previousContents.get(file)) {
    previousContents.set(file, code);
    fs.outputFileSync(file, code);
    exports.fudgeMtime(file);
  }
};

exports.fudgeMtime = file => {
  // need to fudge the mtime so that webpack doesn't go doolally
  const { atime, mtime } = fs.statSync(file);
  fs.utimesSync(
    file,
    new Date(atime.getTime() - 999999),
    new Date(mtime.getTime() - 999999)
  );
};

exports.makeResolve = (...outer) => (...inner) =>
  path.resolve(...outer, ...inner);

exports.cli = () => {
  const args = process.argv.slice(2);
  const watch = args.includes('--watch');
  const build = args.includes('--build');
  const mode = (build && 'production') || 'development';
  return {
    mode,
    watch,
  };
};
