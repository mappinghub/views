var gulp = require('gulp');
var _ = require('underscore');
//var merge = require('gulp-merge-json');

var jsoncombine = require("gulp-jsoncombine");

var addGulpTask = function(repo){
  return gulp.src('site/build/'+repo+'/**/*.jsonld')
        .pipe(jsoncombine(repo+'.jsonld', function (data) {
            return new Buffer.from(JSON.stringify(_.map(data, function(value,key){
              // add github url for entry
        value.githubURL = "https://github.com/mappinghub/views/tree/master/views/"+repo+'/'+key+'sonld';
        return value;
      })));
    }))
    .pipe(gulp.dest('./site/build'));
}



gulp.task('default', function(){
    // compile elements
    addGulpTask("elements");

    //compile mappings
    addGulpTask("mappings");
});

// //   Provide a default object (files are merged in order so object values will be overwritten)

// gulp.src('jsonFiles/**/*.json')
//     .pipe(merge({
//         startObj: { someKey: 'defaultValue' },
//     }))
//     .pipe(gulp.dest('./dist'));

// //    Provide an overwriting object (merged at the end)

// gulp.src('jsonFiles/**/*.json')
//     .pipe(merge({
//         endObj: { someKey: 'specialValue' },
//     }))
//     .pipe(gulp.dest('./dist'));


