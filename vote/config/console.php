<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'language' => 'zh-CN',
    'timeZone' => 'Asia/Shanghai',
    'id' => 'basic-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log','queue', ],
    'controllerNamespace' => 'app\commands',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'components' => [
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'log' => [
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => $db,
        /*redis扩展composer安装：https://github.com/yiisoft/yii2-redis*/
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 6379,
            'database' => 0,
            // yiisoft/yii2-redis >=2.0.7 is required for this.
            'retries' => 1,
        ],
        /*添加队列组件*/
        'queue' => [
            'class' => \yii\queue\redis\Queue::class,
            //'as log' => \yii\queue\LogBehavior::class,
            'redis' => 'redis', // Redis connection component or its config
            'channel' => 'queue', // Queue channel key
        ],
    ],
    'params' => $params,
    /*
    'controllerMap' => [
        'fixture' => [ // Fixture generation command line.
            'class' => 'yii\faker\FixtureController',
        ],
    ],
    */
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

return $config;
