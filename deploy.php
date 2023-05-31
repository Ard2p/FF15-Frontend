<?php
namespace Deployer;

require 'recipe/common.php';
require 'recipe/npm.php';

set('application', 'dev-rx78-3.ff15.ru');
set('repository', 'git@bitbucket.org:ff15/ff15-frontend.git');
set('keep_releases', 5);

set('shared_files', []);
set('shared_dirs', ['dist/videos']);

set('writable_dirs', []);
set('writable_mode', 'chmod');

set('allow_anonymous_stats', false);

localhost()
    ->set('deploy_path', '~/www/{{application}}/frontend');        

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    // 'npm:build',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

after('deploy:update_code', 'npm:install');
after('deploy:failed', 'deploy:unlock');

task('npm:build', function () {
    run("cd {{release_path}} && {{bin/npm}} run build --production");
});