# Views Repository
This repository contains software for auto-generating views of [Mappings](https://github.com/mappinghub/mappings) and [Elements](https://github.com/mappinghub/elements), along with the resulting [Views](https://github.com/mappinghub/views/views).

![](https://travis-ci.org/mappinghub/views.svg?branch=master)
If the build fails, login to travis and click the following [link](https://travis-ci.org/mappinghub/views).

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
