# Views Repository
This repository contains software for auto-generating views of [Mappings](https://github.com/mappinghub/mappings) and [Elements](https://github.com/mappinghub/elements), along with the resulting [Views](https://github.com/mappinghub/views/views).

## Build Status

![](https://travis-ci.org/mappinghub/views.svg?branch=master)

If the build fails, use the following [link](https://travis-ci.org/mappinghub/views) and login to Travis with the shared account to view the log.


## Contributing

Pushing to the master branch of either [Mappings](https://github.com/mappinghub/mappings) or [Elements](https://github.com/mappinghub/elements) will trigger the build process and (if there are no errors) deployment. While working on adding mappings or elements, it is a good idea to use `npm run build` from the views repo to test that the mappings or elements you've added don't break the build. In order to do this, you must run `npm link` from the repositor(y/ies) you are editing, and then `npm link mapping-hub-elements` and/or `npm link mapping-hub-mappings` from the view repository first.


## Build Process

This is how the mappinghub deployment works:
* When the master branch of either [Mapping](https://github.com/mappinghub/mappings) or [Element](https://github.com/mappinghub/elements) repositories update, github triggers [Travis CI] to run a small script.
* This script creates a [curl request](https://github.com/mappinghub/mappings/blob/master/travis.sh) that triggers the build process for this repository.
* Travis pulls the most recent versions of both Mappings and Elements from dependency URLs defined in [package.json](https://github.com/mappinghub/views/blob/master/package.json).
* Travis runs NPM build process:
  * NPM build calls [this script](
https://github.com/mappinghub/views/blob/master/bin/build-views) twice, creating the files and directory structure for the deployment of both Elements and Mappings.
  * The [Gulp script](https://github.com/mappinghub/views/blob/master/gulpfile.js) uses the static template in [./site](https://github.com/mappinghub/views/tree/master/site) to 
    * copy files to deployment directory
    * construct a new version of the mappinghub.github.io site, including filling in build # from the environment variable: TRAVIS_BUILD_NUMBER
* Travis runs NPM test, if that fails, it is not deployed
* Travis deploys to mappinghub.github.io

