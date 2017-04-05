var gulp = require('gulp');
var _ = require('underscore');
//var merge = require('gulp-merge-json');

var jsoncombine = require("gulp-jsoncombine");

gulp.task('default', function(){
    gulp.src('node_modules/mapping-hub-elements/**/*.jsonld')
        .pipe(jsoncombine('elements.jsonld', function (data) {
            console.log()
            return new Buffer.from(JSON.stringify(_.values(data)));
    }))
        .pipe(gulp.dest('./dist/build'));
});

// //    Edit JSON with function
//
// gulp.src('jsonFiles/**/*.json')
//     .pipe(merge({
//         fileName: 'file.json',
//         edit: (parsedJson, file) => {
//             if (parsedJson.someValue) {
//                 delete parsedJson.otherValue;
//             }

//             return parsedJson;
//         },
//     }))
//     .pipe(gulp.dest('./dist'));


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


