<?php
/*基本配置*/
$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'language' => 'zh-CN',
    'timeZone' => 'Asia/Shanghai',
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => [
        'log',
        //'queue', // The component registers its own console commands
        ],
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'modules' => [
        'v1' => [
            'class' => 'app\modules\v1\Module',
            // ... 模块其他配置 ...
        ],
    ],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'OgXUEuvf2gkzocV67Y4F_aawmbSRTUjU',
            // 映射json解析类（在接收请求时使用。）当请求中包含json请求数据时，会调用该配置进行解析
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => false,
            'loginUrl' => null,
            // 在user组件中禁用会话，并禁用登录地址，保持无状态
            // 这一步可以在这里作全局配置，也可以控制器里本地配置
            // 重写init()方法：
            // parent::init();
            // \Yii::$app->user->enableSession = false;
            'enableSession' => false
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => $db,
        // 路由规则
        'urlManager' => [
            'enablePrettyUrl' => true,
            // 开启严格解析模式：只有规则表里的路由可访问，否则，所有的路由有可能被访问，只要存在该控制器
            // 为了安全性，可设为true。测试暂时设置为false
            'enableStrictParsing' => false,
            'showScriptName' => false,
            // 关联数组其实是一个对象
            'rules' => [
                // 配置美化路由后不要忘记改.htaccess文件
                // 规则与控制器的映射，配置默认动作路由
                // 设置 yii\rest\UrlRule::$pluralize 为 false，使默认路由改为非自动复数化
                // 'controller' => ['u' => 'user'],可以配置自由控制映射路由别名。这样不再是users而是u(将自动复数化转为自定义)
                ['class' => 'yii\rest\UrlRule', 'controller' => 'user'],
                // 上面一行与下面的多行效果等同
                /*[
                    'PUT,PATCH users/<id>' => 'user/update',
                    'DELETE users/<id>' => 'user/delete',
                    'GET,HEAD users/<id>' => 'user/view',
                    'POST users' => 'user/create',
                    'GET,HEAD users' => 'user/index',
                    'users/<id>' => 'user/options',
                    'users' => 'user/options',
                ]*/
                // 限制动词配置：
                /*[
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'user',
                    'except' => ['delete', 'create', 'update'],
                ],*/
                // 针对于rest/ActiveController默认路由以外的额外路由配置
                /*[
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'user',
                    'extraPatterns' => [
                        'GET search' => 'search',
                    ],
                ]*/
            ],
        ],
        // 重新改造响应体结构
        'response' => [
            'class' => 'yii\web\Response',
            // 此处必须要强制设置，以避免响应主体不能解释 《级别：严重注意》 00000
            'format' => \yii\web\Response::FORMAT_JSON,
            // 改造响应内容
            'on beforeSend' => function ($event) {
                $response = $event->sender;
                if ($response->statusCode === 200) {
                    $response->data = [
                        'code' => \app\config\Status::SUCCESS,
                        'msg'  => '请求正常',
                        'data' => $response->data,
                    ];
                    $response->statusCode = 200;
                }elseif($response->statusCode === 403){
                    $response->data = [
                        'code' => \app\config\Status::FAIL_TOKEN,
                        'msg'  => 'TOKEN错误',
                        'data' => null,
                    ];
                    $response->statusCode = 200;
                }
//                else{
//                    $response->data = [
//                        'code' => \app\config\Status::FAIL,
//                        'msg'  => '请求失败',
//                        'data' => $response->statusCode,
//                    ];
//                }
            },
        ],
        /*redis扩展composer安装：https://github.com/yiisoft/yii2-redis*/
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => 'localhost',
            'port' => 6379,
            'database' => 0,
            // yiisoft/yii2-redis >=2.0.7 is required for this.
            'retries' => 1,
        ],
        /*添加队列组件,*/
        'queue' => [
            'class' => \yii\queue\redis\Queue::class,
            //'as log' => \yii\queue\LogBehavior::class,
            'redis' => 'redis', // Redis connection component or its config
            'channel' => 'queue', // Queue channel key
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
