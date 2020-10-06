const srcFolder = "src";
const distFolder = "dist";
const del = require('del');
const gulp = require('gulp');
const scss = require('gulp-sass');
const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css');
const cssbeautify = require("gulp-cssbeautify");
const fileinclude = require("gulp-file-include");
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const removeComments = require("gulp-strip-css-comments");
const groupmedia = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');



var path = {
    build: {
        html: distFolder + "/",
        css: distFolder + "/css/",
        js: distFolder + "/js/",
        img: distFolder + "/img/",
        fonts: distFolder + "/fonts/"
    },

    src: {
        html: srcFolder + "/*.html",
        css: srcFolder + "/scss/main.scss",
        js: srcFolder + "/js/script.js",
        img: srcFolder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
        fonts: srcFolder + "/fonts/*.*"
    },

    watch: {
        html: srcFolder + "/**/*.html",
        css: srcFolder + "/scss/**/*.scss",
        js: srcFolder + "/js/**/*.js",
        img: srcFolder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}"
    },

    clean: "./" + distFolder + "/"
}


function browserSyncReload() {
    browsersync.init({
        server: {
            baseDir: "./" + distFolder + "/"
        },
        port: 3000,
        notify: false
    })
}


function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}


function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        })
        )
        .pipe(groupmedia())
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(removeComments())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cleancss())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts(){
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.img], images);
}


function clean() {
    return del(path.clean)
}


let build = gulp.series(clean, gulp.parallel(css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSyncReload);


exports.css = css;
exports.html = html;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;