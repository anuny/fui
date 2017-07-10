'use strict';
const options         = require('./config.json');
const gulp            = require('gulp');
const less            = require('gulp-less');
const swig            = require('gulp-swig');
var   replace         = require('gulp-replace');
const rename          = require('gulp-rename');
const uglify          = require('gulp-uglify');
const minifycss       = require('gulp-minify-css');
const autoprefixer    = require('gulp-autoprefixer');
const concat          = require('gulp-concat');
const header          = require("gulp-header");
const size            = require("gulp-size");
const changed         = require('gulp-changed');
const include         = require("gulp-include");
const gulpif          = require('gulp-if');
const browserSync     = require("browser-sync");
const reload          = browserSync.reload;


var swigOptions = {
	defaults: {
		cache: false, 
		locals: {
			system: options.system 
		}
	},
	data: options.site
};

var BASE = {
	SRC    : './src',
	DIST   : './dist'
};


var SUFFIX = {
	TPL    : options.system.fix.tpl||'{html,htm,tpl,ejs}',
	CSS    : options.system.fix.css||'{less,css}',
	IMAGES : options.system.fix.images||'{jpg,png,gif,bmp,svg,ico}',
	FONTS  : options.system.fix.fonts||'{otf,eot,svg,ttf,woff,woff2}',
	HTML   : options.system.fix.html||'.html',
	FILTER : options.system.filter||'@',
};

var PATH = {
	SRC:{
		DOC    : BASE.SRC + '/doc/**/*.' + SUFFIX.TPL,
		DATAS  : BASE.SRC + '/datas/**/*.*',
		JS     : BASE.SRC + '/js/**/*.js',
		LANG   : BASE.SRC + '/lang/**/*.js',
		CSS    : BASE.SRC + '/theme/' + options.system.theme + '/css/**/*.' + SUFFIX.CSS,
		IMAGES : BASE.SRC + '/theme/' + options.system.theme + '/images/**/*.' + SUFFIX.IMAGES,
		FONTS  : BASE.SRC + '/theme/' + options.system.theme + '/fonts/**/*.'+ SUFFIX.FONTS
	},
	DIST:{
		DOC    : BASE.DIST,
		DATAS  : BASE.DIST + '/datas/',
		JS     : BASE.DIST + '/fui/',
		LANG   : BASE.DIST + '/fui/lang/',
		CSS    : BASE.DIST + '/fui/theme/' + options.system.theme + '/css/',
		IMAGES : BASE.DIST + '/fui/theme/' + options.system.theme + '/images/',
		FONTS  : BASE.DIST + '/fui/theme/' + options.system.theme + '/fonts/'
	}
};


var comment = `/**
 * Fui v${options.system.version}
 * Copyright 2016-2017 Anuny
 * Released under the MIT License
 * http://yangfei.name
 */\r\n`;

var isReload = options.system.reloadBrowser && reload;
var isWatch = options.system.watch;
var isOpenBrowser = options.system.openBrowser;

function fileFilter(file){
	return file.relative.indexOf(SUFFIX.FILTER)==-1
}

gulp.task('_docHtml', function () {
    return gulp.src(PATH.SRC.DOC)
		.pipe(changed(PATH.DIST.DOC))
		.pipe(swig(swigOptions))
		.pipe(rename({extname: SUFFIX.HTML}))
		.pipe(gulpif(fileFilter,gulp.dest(PATH.DIST.DOC)));
});

gulp.task('_doc', ['_docHtml'], function () {
    return gulp.src(BASE.SRC+'/doc/static/**/*.*')
		.pipe(changed(PATH.DIST.DOC+'/static/'))
		.pipe(gulpif(fileFilter,gulp.dest(PATH.DIST.DOC+'/static/')));
});


gulp.task('css',['_less'],function(){
	if(options.system.cssPreFix){
		gulp.start('autoprefixer');
	}
});



gulp.task('_less', function () {
    return gulp.src(PATH.SRC.CSS)
		.pipe(changed(PATH.DIST.CSS))
		.pipe(gulpif(fileFilter,less()))
		.pipe(gulpif(fileFilter,
			gulp.dest(PATH.DIST.CSS)
		));
});



gulp.task('autoprefixer', function () {
    return gulp.src(PATH.DIST.CSS+'/**/*.css')
		.pipe(autoprefixer({
			browsers: options.system.browsersVer,
            cascade: true
		}))
		.pipe(gulp.dest(PATH.DIST.CSS))
		.pipe(gulpif(isReload, browserSync.stream()));
});


gulp.task('mini', function() {
    return gulp.src(PATH.DIST.JS+'fui.js')
		.pipe(uglify())
		.pipe(header(comment))
		.pipe(size())
		.pipe(size({
			gzip: true
		}))
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest(PATH.DIST.JS));
});

gulp.task('js', function () {
    return gulp.src(BASE.SRC + '/js/index.js')
		.pipe(include())
		.pipe(concat('fui.js'))
		.pipe(header(comment + '\n'))
		.pipe(replace('__FUI__VERSION__', options.system.version))
		.pipe(size())
		.pipe(gulp.dest(PATH.DIST.JS))
		.pipe(gulpif(isReload, browserSync.stream()));
});

gulp.task('lang', function () {
    return gulp.src(PATH.SRC.LANG)
		.pipe(changed(PATH.DIST.LANG))
		.pipe(gulpif(fileFilter,gulp.dest(PATH.DIST.LANG)))
		.pipe(gulpif(isReload, browserSync.stream()));
});


gulp.task('images', function () {
    return gulp.src(PATH.SRC.IMAGES)
		.pipe(changed(PATH.DIST.IMAGES))
		.pipe(gulpif(fileFilter,gulp.dest(PATH.DIST.IMAGES)))
		.pipe(gulpif(isReload, browserSync.stream()));
});

gulp.task('fonts', function () {
    return gulp.src(PATH.SRC.FONTS)
		.pipe(changed(PATH.DIST.FONTS))
		.pipe(gulpif(fileFilter,gulp.dest(PATH.DIST.FONTS)))
		.pipe(gulpif(isReload, browserSync.stream()));
});

gulp.task('datas', function () {
    return gulp.src(PATH.SRC.DATAS)
		.pipe(changed(PATH.DIST.DATAS))
		.pipe(gulpif(fileFilter,gulp.dest(PATH.DIST.DATAS)))
		.pipe(gulpif(isReload, browserSync.stream()));
});

gulp.task('doc',['_doc'],isReload && reload);

gulp.task('server',['doc','css','js','lang','images','fonts','datas'],function(){
	browserSync({server:PATH.DIST.DOC,notify: false,open: isOpenBrowser});
	if(!isWatch) return;
	gulp.watch(PATH.SRC.DOC,    ['doc']);
	gulp.watch(PATH.SRC.CSS,    ['css']);
	gulp.watch(PATH.SRC.JS,     ['js']);
	gulp.watch(PATH.SRC.LANG,   ['lang']);
	gulp.watch(PATH.SRC.IMAGES, ['images']);
	gulp.watch(PATH.SRC.FONTS,  ['fonts']);
	gulp.watch(PATH.SRC.DATAS,  ['datas']);
});

gulp.task('default',['server']); 