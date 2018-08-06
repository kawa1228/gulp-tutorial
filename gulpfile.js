const fs = require('fs')
const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const flexBugsFixes = require('postcss-flexbugs-fixes')
const cssWring = require('csswring')
const ejs = require("gulp-ejs")
const htmlmin = require("gulp-htmlmin")
const browserSync = require("browser-sync").create()

const configJsonData = fs.readFileSync('./src/ejs/config.json')
const configObj = JSON.parse(configJsonData)

const autoprefixerOption = {
    grid: true
}

const postcssOption = [ 
    flexBugsFixes,
    autoprefixer(autoprefixerOption),
    cssWring
 ]

const browserSyncOption = {
    server: './dist'
}

gulp.task('sass', () => {
    return gulp.src('./src/sass/common.scss')
        .pipe(sass())
        .pipe(postcss(postcssOption))
        .pipe(gulp.dest('./dist'))
})

gulp.task('watch', ()=> {
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'))
    gulp.watch('./src/html/**/*.ejs', gulp.series('ejs'))

})

gulp.task('serve', (done) => {
    browserSync.init(browserSyncOption)
    done()
})

//ejsデータ読み込み設定
const ejsDataOption = {
    config: configObj
}
//ejsコンパイル設定用のオブジェクト
const ejsSettingOption = {
    ext: '.html'
}

const htmlminOption = {
    collapseWhitespace: true
}
//ejsをコンパイルするタスク
gulp.task('ejs',() => {
    return gulp
        .src('./src/html/*.ejs')
        .pipe(ejs(ejsDataOption, {}, ejsSettingOption))
        .pipe(htmlmin(htmlminOption))
        .pipe(gulp.dest('./dist'))
})

