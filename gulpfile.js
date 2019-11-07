'use strict';

const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');
const prefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const rimraf = require('rimraf');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');

// RELOAD
	function reload(done) {
		// Just reload
		browserSync.reload();
		done();
	}

// HTML
	function html() {
		return src('app/*.html')
			.pipe(rigger())
			.pipe(dest('dist'))
			.pipe(browserSync.reload({ stream: true }))
	}

// CSS
	function scss() {
		return src('app/scss/main.scss', { sourcemaps: true })
			.pipe(sass())
			.pipe(prefixer({ remove: false }))
			.pipe(dest('dist/css'))
			.pipe(cssmin())
			.pipe(rename({ suffix: '.min' }))
			.pipe(dest('dist/css', { sourcemaps: '.' }))
			.pipe(browserSync.reload({ stream: true }))
	}	

// JS
	function js() {
		return src('app/js/main.js', { sourcemaps: true })
			.pipe(uglify())
			.pipe(rename({ suffix: '.min' }))
			.pipe(dest('dist/js', { sourcemaps: '.' }))
			.pipe(browserSync.reload({ stream: true }))
	}

// Watcher
	function watcher() {
		watch(['app/*.html', 'app/template/*.html'], parallel(html));
		watch(['app/js/main.js', 'app/js/include/*.js'], parallel(js));
		watch(['app/scss/main.scss', 'app/scss/include/*.scss'], parallel(scss));
		watch('app/lib/*.*', parallel(vendor));
	}

// Server
	function server() {
		browserSync.init({
			server: './dist',
			directory: true,
			notify: false,
			open: false
		});
	}

// Vendor
	function vendor() {
		return src('app/lib/**/*.*')
			.pipe(dest('dist/lib'))
			.pipe(browserSync.reload({ stream: true }))
	}

// Clean
	function clean(cb) {
		rimraf('./dist', cb);
	}

// Modules
	exports.js = js;
	exports.scss = scss;
	exports.html = html;
	exports.vendor = vendor;

	exports.watcher = watcher;
	exports.server = server;
	exports.clean = clean;

	exports.build = series(clean, parallel(html, scss, js, vendor));
	exports.default = parallel(server, watcher);


