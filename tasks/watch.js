
import gulp from 'gulp';

export default () =>
  
  gulp
    .watch(
      ['./challenge.js', './lib/**/*', './test/**/*'],
      ['lint', 'test', 'babel', 'browserify', 'browserify-test', 'compress', 'live-reload']);