var gulp        = require('gulp'),
    less        = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer= require('gulp-autoprefixer'),
    smartgrid   = require('smart-grid');



gulp.task('less', function(){
	return gulp.src('app/less/**/*.less')
		.pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8','ie 7'],{ cascade: true}))
		.pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});


/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'less', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '560px'
        }
        /* 
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};

smartgrid('./app/less/', settings);



gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
}); 

gulp.task('css-libs',['less'], function(){
   return gulp.src('app/css/libs.css') 
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function(){
   browserSync({
       server:{
           baseDir:'app'
       }
   }); 
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('clear', function() {
    return cache.clearAll();
});


gulp.task('img', function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch',['browser-sync','css-libs','scripts'],function(){
    gulp.watch('app/less/**/*.less',['less'])
    gulp.watch('app/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.js',browserSync.reload);
});


gulp.task('build', ['clean','img', 'less','scripts'], function(){
    
    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css', 
    ])
    .pipe(gulp.dest('dist/css'));
    
    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
    
    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));
    
    var buidHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});
