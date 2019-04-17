<?php
namespace app\modules\v1\controllers;
use app\modules\v1\controllers\parent\PublicController;
use app\models\User;
use app\config\Status;
class UserPublicController extends PublicController
{
    /**
     * @return array
     * @throws \yii\base\InvalidConfigException
     * 注册账号
     */
    public function actionCreate()
    {
        // 解析用户请求数据
        $reqParams = \Yii::$app->request->getBodyParams();
        // 调用模型进行处理
        $user = new User();
        $user->load($reqParams,'');
        // 返回处理结果
        if($user->create()){
            return ['bCode'=>Status::SUCCESS,'bData'=>$user];
        }
        return ['bCode'=>Status::FAIL,'bData'=>$user->errors];
    }

    /**
     * @return bool
     * 控制器测试,检测是否可访问
     */
    public function actionTest() {
        return true;
    }
}