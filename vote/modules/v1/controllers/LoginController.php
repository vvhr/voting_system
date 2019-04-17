<?php
namespace app\modules\v1\controllers;
use yii\filters\Cors;
use yii\helpers\ArrayHelper;
use yii\rest\Controller;
use app\models\User;
class LoginController extends Controller
{
    public function behaviors()
    {
        $behaviors = ArrayHelper::merge(
            [
                [
                    'class' => Cors::class,
                ],
            ],
            parent::behaviors()
        );
        return $behaviors;
    }
    /**
     * @throws \yii\base\InvalidConfigException
     */
    public function actionGetToken(){
        $params = \Yii::$app->request->getBodyParams();
        $token = User::getToken($params['username'],$params['password']);
        // 每个控制器返回一个数组转给响应组件处理？
        if($token)
            return ['token'=>$token];
        return $token;
    }

    /**
     * @return User|null
     */
    public function actionGetInfo(){
        $token = \Yii::$app->request->get('token');
        return User::findOne(['token'=>$token]);
    }
}