var gulp = require('gulp');
var _ = require('underscore');
//var merge = require('gulp-merge-json');

var jsoncombine = require("gulp-jsoncombine");
var replace = require("gulp-replace");

var updatedData;

var addGulpTask = function(repo, publicURL){
  return gulp.src('site/build/'+repo+'/**/*.jsonld')
        .pipe(jsoncombine(repo+'.jsonld', function (data) {
            updatedData = [];
            _.forEach ( data, function ( object, key ) {
                object.hostedURL = "/build/"+repo+'/'+key+'sonld';
                object.githubURL = publicURL+repo+'/'+key+'sonld';
                if ( object.maps )
                  object.maps.forEach( function (mapping) {
                    updatedData.push(_.extend(_.omit(object,"maps"),{"maps":[mapping]}));
                  });
                else
                  updatedData.push(object);
            });
            return new Buffer.from(JSON.stringify(updatedData));
        }))
        .pipe(gulp.dest('./site/build'));
}

function updateSite(){
  gulp.src(['site/index.html','site/package.json'])
    .pipe(replace('$BUILDNUMBER',process.env.TRAVIS_BUILD_NUMBER))
    .pipe(gulp.dest('site/'));

  gulp.src(['site/README.md'])
    .pipe(replace('You may edit the site here. (do not change/remove this line!)',
      'Do not edit the site here!'))
    .pipe(gulp.dest('site/'));
}


gulp.task('default', function(){
    // compile elements
    addGulpTask("elements", "https://github.com/mappinghub/elements/blob/master/");
    if (process.env.TRAVIS_BUILD_NUMBER) updateSite();
    //compile mappings
    addGulpTask("mappings", "https://github.com/mappinghub/mappings/blob/master/");
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


