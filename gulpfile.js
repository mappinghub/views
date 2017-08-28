var gulp = require('gulp');
var _ = require('underscore');
//var merge = require('gulp-merge-json');

var jsoncombine = require("gulp-jsoncombine");
var replace = require("gulp-replace");

var addGulpTask = function(repo){
  return gulp.src('site/build/'+repo+'/**/*.jsonld')
        .pipe(jsoncombine(repo+'.jsonld', function (data) {
            return new Buffer.from(JSON.stringify(_.map(data, function(value,key){
              // add github url for entry
        value.githubURL = "/build/"+repo+'/'+key+'sonld';
        return value;
      })));
    }))
    .pipe(gulp.dest('./site/build'));
}
function updateSite(){
  gulp.src(['site/index.html','site/package.json'])
    .pipe(replace('$BUILDNUMBER',process.env.TRAVIS_BUILD_NUMBER))
    .pipe(gulp.dest('site/'));

  gulp.src(['site/README.md'])
    .pipe(replace('You may edit the site here. (do not change/remove this line!)
','Do not edit the site here!'))
    .pipe(gupl.dest('site/'));
}


gulp.task('default', function(){
    // compile elements
    addGulpTask("elements");
    updateSite();
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


