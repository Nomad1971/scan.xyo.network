/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: gulpfile.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 2, 2018 3:28 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */



/*
* TODO's
* [ ] - live reload working
*
* */
const es = require('event-stream');
const gulp = require('gulp');

const kit = require('gulp-kit');
const concat = require('gulp-concat');
// var inject = require('gulp-inject');
const gutil = require('gulp-util');

const htmlmin = require('gulp-htmlmin');

// var pump = require('pump');
//const sourcemaps = require('gulp-sourcemaps');
const include = require('gulp-include');
const uglify = require('gulp-uglify');

//css
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css')
const cssCopyAssets = require('gulp-css-copy-assets');
const purify = require('gulp-purify-css');
/*const cleanCSS = require('gulp-clean-css');*/

const rename = require('gulp-rename');
const debug = require('gulp-debug');
const connect = require('gulp-connect');
const open = require('gulp-open');

const gulpS3Upload = require('gulp-s3-upload')({
  useIAM: true
});

const SOURCE_BASE = './src';
const OUTPUT_BASE = './dist';

const PORT = 8080;

const getLocation = (base, location) => {
	return `${base}${location}`;
};

const compileSCSS = () => {
	let scss = gulp.src(getLocation(SOURCE_BASE, '/css/**/*.scss'))
		.pipe(sass({
			includePaths: [
				'./node_modules/'
			]
		}).on('error', (err) => {
      console.log(err.message);
      watch();
    }))

	let css =
		gulp.src(getLocation(SOURCE_BASE,'/css/**/*.css'))
			//.pipe(sourcemaps.write('./'));

	return es.merge(scss, css)
		/*would like to get this working .pipe(cssCopyAssets)*/
		.pipe(concat('all.css'))
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest(getLocation(OUTPUT_BASE, '/css/')))
    .pipe(connect.reload());

};

const serve = () => {
	connect.server({
		livereload: true,
		root: OUTPUT_BASE,
		port: PORT
	});
	gulp.src(__dirname)
		.pipe(open({
			app: 'google chrome',
			uri: `http://localhost:${PORT}`
		}))
};

const compileKit = () => {
	return gulp.src(getLocation(SOURCE_BASE,'/**/*.kit'))
		.pipe(kit().on('error', (err) => {
      console.log(err.message);
      watch();
    }))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(OUTPUT_BASE))
		.pipe(connect.reload());
};

const compileJS = () => {
	const jsIncludes = {
		extension: 'js',
		hardFail: true,
		includePaths: [
			'./node_modules',
			getLocation(SOURCE_BASE, '/js')
		]
	};

	const all = gulp.src(getLocation(SOURCE_BASE, '/js/all-require.js'))
		.pipe(include(jsIncludes).on('error', (error) => {
      console.log(error.message);
    }))
		.pipe(rename({
			basename: 'all',
			suffix: '-dist',
			extname: '.js'
		}))
		/*.pipe(uglify())*/
		.pipe(gulp.dest(getLocation(OUTPUT_BASE, '/js/')))
		.pipe(connect.reload());

	return [ all ];
};

const purifyCSS = () => {
	return gulp.src(getLocation(OUTPUT_BASE, '/css/all.css'))
		.pipe(purify([
			getLocation(OUTPUT_BASE, '/**/*.html'),
			getLocation(OUTPUT_BASE, '/**/*.js')
		]))
		.pipe(connect.reload());;
};

const processImages = () => {
	return gulp.src([
			getLocation(SOURCE_BASE,'/img/**/*'),
			getLocation(SOURCE_BASE,'/css/**/*.gif'),
			getLocation(SOURCE_BASE,'/**/*.ico')
		], { base : SOURCE_BASE })
		.pipe(gulp.dest(OUTPUT_BASE))
		.pipe(connect.reload());
};

const processFonts = () => {
	return gulp.src([
			getLocation(SOURCE_BASE, '/fonts/**/*')
		], { base: SOURCE_BASE })
		.pipe(gulp.dest(OUTPUT_BASE))
		.pipe(connect.reload());
};

const processData = () => {
	return gulp.src([
			getLocation(SOURCE_BASE, '/**/*.json'),
			getLocation(SOURCE_BASE,'/**/*.xml')
		], { base: SOURCE_BASE })
		.pipe(gulp.dest(OUTPUT_BASE))
		.pipe(connect.reload());
};

const publish = () => {
  gulp.src("./dist/**")
    .pipe(gulpS3Upload({
      Bucket: 'scan.xyo.network', //  Required
      ACL: 'public-read' //  Needs to be user-defined
    }, {
      // S3 Constructor Options, ie:
      maxRetries: 5
    }));
};

const reloadPage = (event) => {
  console.log(">>>>>>> Reload Page <<<<<<<");
	console.log(event);
	connect.reload();
};

const watch = () => {
  gulp.watch(getLocation(SOURCE_BASE, '/css/**/*.*'), ['sass', 'purify'], reloadPage);
  gulp.watch(getLocation(SOURCE_BASE, '/js/**/*.*'), ['js'], reloadPage);
  gulp.watch(getLocation(SOURCE_BASE, '/**/*.kit'), ['kit'], reloadPage);
};

gulp.task('default', ['develop']);
gulp.task('develop', ['kit', 'sass', 'js', 'assets', 'watch'], (callback) => {
	purifyCSS();
	serve();
	callback();
});
gulp.task('release', ['kit', 'sass', 'js', 'purify', 'assets']);
gulp.task('assets', ['images', 'fonts', 'data']);
gulp.task('watch', () => {
  watch();
});
gulp.task('serve', serve);
gulp.task('sass', compileSCSS);
gulp.task('purify', purifyCSS);
gulp.task('js', compileJS);
gulp.task('kit', compileKit);
gulp.task('images', processImages);
gulp.task('fonts', processFonts);
gulp.task('data', processData);
gulp.task('publish', publish);
