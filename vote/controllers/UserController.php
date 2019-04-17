<?php
/**
 * Created by PhpStorm.
 * User: tony
 * Date: 2018/5/31
 * Time: 14:31
 */

namespace app\controllers;

use Yii;
use yii\data\ActiveDataProvider;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\helpers\ArrayHelper;
use yii\rest\ActiveController;
use app\models\User;

/**
 * 这是一个基本的ActiveController类,已实现了几个基本的路由所映射的动作（组件？）
 * 在路由管理中，也配置了基本的路由与动作（组件？）的映射
 * 其实也可以将一个动作看成是vue中的一个组件，由数据与视图共同组成了一个组件？
 *
 * 准备工作（在全局配置中）：
 * 1、请求数据包解析器就位
 * 2、路由管理器就位
 * 3、用户管理模型就位
 *
 * Class UserController
 * @package app\
 */
class UserController extends ActiveController
{
    // 映射的模型对象:在默认动作要调用资源时，默认用哪个模型类来调度资源
    public $modelClass = User::class;

    /**
     * 自定义序列化行为类
     * 默认将页码信息放在响应头部
     * 以下配置将所有信息序列化到bodyData里面，时面将包括全局links以及头部的_meta中页码相关信息
     * @var array
     */
    public $serializer = [
        'class' => 'yii\rest\Serializer',
        // 配置集合包含
        'collectionEnvelope' => 'bodyData',
    ];

    /**
     * rest/controller 默认按以下顺序执行过滤器（在behaviors()中声明后，即可在生命周期回调中执行）：
     * 内容协商：contentNegotiator
     * 动词过滤：verbFilter
     * 用户认证过滤：authenticator
     * 速率过滤： rateLimiter
     * CORS filter: 路域名资源共享过滤器：该过滤器默必须配置在所有过滤器之前执行。因为它是先决条件。它会发送CORS头部
     * 它定义了哪些资源允许跨域请求
     * @return array
     */
    public function behaviors()
    {
        // var_dump(parent::behaviors());
        $behaviors = ArrayHelper::merge(
            [
                [
                    'class' => Cors::class,
                    // 如果全部资源可跨域，下面语句可省略
                    'cors' => [
                        // 配置可请求的来源，可以是一个httpUrl,也可以是通配符*,默认是*
                        'Origin' => ['*'],
                        // 动词过滤
                        'Access-Control-Request-Method' => ['GET','POST'],
                        // ...其它配置可参看文档
                    ],
                ],
            ],
            /**
             * 响应数据的决定性过程：
             * 首先，从客户端请求读取content negotiation，并确定未来需转化的格式要求
             * 然后，rest/Serializer会将对象转为数组
             * 最后，按内容协商的要求，将数组转成字符串最后输出。这一步通过response组件来完成。并在响应中包含响应格式文档类型头
             *
             * 默认响应组件支持json与xml。
             * 如果要支持html或其它格式，可以加入以下过滤器配置进行支持。
             * 问题是：如果你想响应html，请求那边要求的也是html,那么，你的控制器必须返回字符串，如果返回数组或对象，就会抛出“不能是数组”的异常
             * 如果，客户端请求没有明确指出内容格式要求，默认是用第一个解析器进行解析，
             * 在下面的设置中，text/html将成为第一个解析器，所以按以下配置默认是会抛出‘不能是数组’异常的。
             * 引用文档的话说：“formats 属性的keys支持 MIME 类型，而 values 必须在 yii\web\Response::$formatters 中支持被响应格式名称。”
             * 响应数据将资源对象或资源集合按内容协商要求进行序列化
             */
            /*[
                'contentNegotiator' => [
                    'formats' => ['text/html' => Response::FORMAT_HTML]
                ]
            ],*/

            parent::behaviors()
        );
        /**
         * 配置认证行为，检测access_token
         * 再配置认证用到的模型，比如model/User
         * 这里必须实现user组件中配置的认证模型中的yii\web\IdentityInterface::findIdentityByAccessToken()方法
         * 请求方法是在头部增加请求参数：Authorization: Bearer XXXXX
         */
        $behaviors['authenticator'] = ['class' => HttpBearerAuth::class];
        // 一量User类实现了速率接口，会自动开启速率限制，不想用，可在此改为false
        // $behaviors['rateLimiter']['enableRateLimitHeaders'] = false;
//        var_dump('$behaviors', $behaviors); exit;
        return $behaviors;
    }

    /**
     * rest/ActiveController默认实现了一系列通用动作方法，可以在此禁用这些默认方法。以及更改默认数据提供者，以自定义返回数据
     * @return array
     */
//    public function actions()
//    {
//        $actions = parent::actions();
//
//        // 禁用"delete" 和 "create" 动作
//        unset($actions['delete'], $actions['create']);
//
//        // 使用"prepareDataProvider()"方法自定义数据provider的方法，这个方法可以包含在任何自定义类的自定义方法里
//        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];
//
//        return $actions;
//    }

    /**
     * 为路由自定义数据提供者或返回数据
     * @return array
     */
   /* public function prepareDataProvider()
    {
        // 为"index"动作准备和返回数据provider
        return ['我自己搞的数据，不用默认的！'];
    }*/

    /**
     * 自定义动作方法与用户的访问权限检查机制。这是个回调方法,每个ActiveController中默认动作都会自动执行一次
     * 如果要在自定义动作方法中进行权限检查，需要在自定义方法明确调用checkAccess方法
     * @param string $action
     * @param null $model
     * @param array $params
     * @throws \yii\web\ForbiddenHttpException
     */
    public function checkAccess($action, $model = null, $params = [])
    {
        // check if the user can access $action and $model
        // throw ForbiddenHttpException if access should be denied
        // 权限检查不通过，应该抛出一个Forbidden的错误，状态403
//        if ($action === 'view' || $action === 'index') {
//            if ($model->id !== 2)
//                throw new \yii\web\ForbiddenHttpException(sprintf('You can only %s articles that you\'ve created.', $action));
//        }
    }

    // 控制器的任务是直接返回一个模型对象，这样，响应器会利用数据处理器(或者模型本身在执行查询并输出的时候，按相关规则对结果进行二次整理)，
    // 根据模型的其它规则方法及属性进行处理。
    // 利用对象自身的方法及属性进行处理以配合其它对象，属于对象强聚合
    /**
     * 一个简单的示例
     * @return User[]
     * web应用与RESTfull应用的差别是，web用render进行最后的数据输出前整理，后者用serializer 与 response object进行最后的数据处理转换
     */
    public function actionFieldsFilter(){
        $res = User::findAll([1,2]);
        // 经调试，$res是一个数组，包含了两条活动记录对象
        // var_dump($res);
        return $res;
    }

    // 数据提供者示例
    public function actionDataProvider(){
        // 以下是一个load示例
        /*$user = new User();
        $reqData = [
            'username' => 'test',
            'password' => 'test',
            'token' => '123'
        ];
        $user->load($reqData,'');
        $res = $user->save();*/
        // yii\rest\Serializer会在响应时利用dataProvider做二次处理:取出当前页作为当前返回数组，并在头部包含页信息
        // 该对象在初始化时，会自动接收全局变量中的查询参数page参数，并设定好要输出的当前页码信息。如没有默认为第一页
        return new ActiveDataProvider([
            // 基本构造参数是一个活动记录对象（返回数据可能是对象数组或活动记录对象）或一个查询对象（返回数据将是对象数组）
            // 返回一个Post实例的数组： $posts = $provider->getModels();
            // 如果是查询对象，可以这样： $query = (new Query())->from('post')->where(['status' => 1]);
            // 这时上面的语句$provider->getModels()将返回原始数组
            // 模型参数可以是多种，还可以是sql语句，数组等，甚至通过自定义可以是一个cvs表格，具体参阅文档
            'query' => User::find(),
            // 分页信息
            'pagination' => [
                'pageSize' => 2,
            ],
            // 排序信息
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC,
                    'username' => SORT_ASC,
                ]
            ],
        ]);
    }

    // 用户认证示例
    public function actionUserInfo(){
        var_dump(Yii::$app->user->identity);
        return ['user info'];

    }

}