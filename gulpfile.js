var gulp = require('gulp')
var rsync = require('gulp-rsync')
var prompt = require('gulp-prompt')
var gulpif = require('gulp-if')
var argv  = require('minimist')(process.argv)

var  deployment_folders_site = [
    './YOUR_DEPLOY_DIR'
]

gulp.task('deploy',function(){
    rsyncPaths = deployment_folders_site
    rsyncConf = {
        progress: true,
        incremental: true,
        relative: true,
        emptyDirectories: true,
        recursive: true,
        syncDest: true,
        //clean: true,
        exclude: [
          // 'EXLUDED_FOLDERS'
        ],
    }
    if (argv.production) {

        rsyncConf.hostname = process.env.PRODUCTION_HOST // hostname
        rsyncConf.username =  process.env.PRODUCTION_USERNAME // ssh username
        rsyncConf.destination = '/home/dir/' // path where uploaded files go
        // Missing/Invalid Target
    } else {
        throwError('deploy', gutil.colors.red('Missing or invalid target'))
    }

    // Use gulp-rsync to sync the files
    return gulp.src(rsyncPaths)
        .pipe(gulpif(
            argv.production,
            prompt.confirm({
                message: 'Heads Up! Are you SURE you want to push to PRODUCTION?',
                default: false
            })
        ))
        .pipe(rsync(rsyncConf))
})
