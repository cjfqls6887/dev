const gulp = require('gulp')
const babel = require('gulp-babel');
const concat =require('gulp-concat');
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
    scss : ['assets/resource/scss/*.scss','assets/resource/scss/**/*.scss'],
    js : 'assets/resource/js/*.js'
}
gulp.task('sass', function (){
    return gulp.src(paths.scss[0]) /* Error1 */
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
    .pipe(sourcemaps.write('./assets/resource'))
    .pipe(gulp.dest('assets/public/css'));
})

gulp.task('js',function () {
    return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env','es2015','register']
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('./assets/resource'))
    .pipe(gulp.dest('assets/public/js'));
})


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('default',[
    'sass','js','watch'
])


/* 

Error1

default.scss에서 
변수선언 scss import, 메인.scss import하고 변수를 사용했는데 
에러가 발생 

위의 와치에서 1뎁스 사스파일과 2뎁스 사스파일이 변경시 test(sass)를 실행는데
1뎁스인 default.scss에서 변수선언 scss파일과 변수사용 scss파일을 가져와서 컴파일 해야하는데
2뎁스 파일에서 컴파일되서 발생하는 문제 변수선언 파일과 변수사용 파일이 서로 만나지 않았는데 컴파일 되는거임
결론은 tast(sass)에서 2뎁스를 제거해주니 정상작동

*/