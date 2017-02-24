var gulp = require('gulp'),
gulpWatch = require('gulp-watch'),
del = require('del'),
runSequence = require('run-sequence'),
argv = process.argv;

var embedTemplates = require('gulp-angular-embed-templates');
/**

gulp prepare
gulp move1
gulp clean1
gulp embed
gulp compile
gulp clean2
gulp move2
gulp clean3

 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
 gulp.task('serve:before', ['watch']);
 gulp.task('emulate:before', ['build']);
 gulp.task('deploy:before', ['build']);
 gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
 var buildBrowserify = require('ionic-gulp-browserify-typescript');
  var buildBrowserify2 = require('ionic-gulp-browserify-typescript2');
 var buildSass = require('ionic-gulp-sass-build');
 var copyHTML = require('ionic-gulp-html-copy');
 var copyFonts = require('ionic-gulp-fonts-copy');
 var copyScripts = require('ionic-gulp-scripts-copy');

 gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
    );
});

 gulp.task('prepare', function(done){
  runSequence(
    ['sass', 'html', 'fonts'],
    function(){    
    })});

 gulp.task('move1', function(done){
  return gulp.src(['./app/**/*.*'], { base: './app/' })
  .pipe(gulp.dest('__app'));
});

 gulp.task('clean1', function(done){
  return del('app');
});


 gulp.task('clean2', function(done){
  return del('app');
});


 gulp.task('move2', function(done){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  return gulp.src(['./__app/**/*.*'], { base: './__app/' })
  .pipe(gulp.dest('app'));
});

 gulp.task('clean3', function(done){
  return del('__app');
});

 gulp.task('embed', function (done) {
    return gulp.src('__app/**/*.ts') // also can use *.js files 
    .pipe(embedTemplates({sourceType:'ts', basePath: 'www/', minimize: { quotes: true }}))
    .pipe(gulp.dest('./app'));
  });

 gulp.task('compile', function(done){
  runSequence(
    ['scripts'],
    function(){
      buildBrowserify({
        watch: false,
        minify: true,
        uglifyOptions: {
          mangle: true
        },
        browserifyOptions: {
  debug: false, syntax: false // sourcemaps off
}, 
tsifyOptions: { noImplicitAny: false, allowSyntheticDefaultImports: true,  removeComments: true, skipDefaultLibCheck: true, target: "ES5"} }).on('end', done);
    }
    );
});


 gulp.task('vendor', function(done){
  runSequence(
    ['scripts'],
    function(){
      buildBrowserify2({
        watch: false,
        minify: true,
        uglifyOptions: {
          mangle: true
        },
        browserifyOptions: {
  debug: false, syntax: false // sourcemaps off
}, 
tsifyOptions: { noImplicitAny: false, allowSyntheticDefaultImports: true,  removeComments: true, skipDefaultLibCheck: true, target: "ES5"} }).on('end', done);
    }
    );
});

 gulp.task('prod', function(done){
  runSequence(
    ['sass', 'html', 'fonts'], 
    'move1',
    'clean1',
    'embed', 
    'compile', 
    'clean2',
    'move2',
    'clean3' 
);});

 gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
            /*minify: true,
        uglifyOptions: {
          mangle: false
        },
  browserifyOptions: {
  debug: false, syntax: false // sourcemaps off
}, */
tsifyOptions: { noImplicitAny: false, allowSyntheticDefaultImports: true,  removeComments: true, skipDefaultLibCheck: true, target: "ES5"} }).on('end', done);
    }
    );
});

 gulp.task('sass', function(){
  return buildSass({
    sassOptions: {
      outputStyle: "compressed",
includePaths: [
'node_modules/ionic-angular',
'node_modules/ionicons/dist/scss'
]
}
});
});

 gulp.task('mysass', function(){
  return buildSass({
    sassOptions: {
      outputStyle: "compressed",
includePaths: []
}
});
});

 gulp.task('html', copyHTML);
 gulp.task('fonts', copyFonts);
//gulp.task('scripts', copyScripts);
gulp.task('scripts', function () {
  return copyScripts({
    src: [
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/zone.js/dist/zone.min.js',
    'node_modules/reflect-metadata/Reflect.js',
            //'node_modules/intl/dist/Intl.min.js', // Fix internationalization on safari browsers (used in angular2 currency pipes)
            //'node_modules/intl/locale-data/jsonp/ru.js', // Russian locale
            //'node_modules/intl/locale-data/jsonp/en.js', // English locale
            'resources/lib/vendor.bundle.js',
            'resources/lib/shims_for_IE.js'
            ]
          });
});

gulp.task('clean', function(){
  return del('www/build');
});
