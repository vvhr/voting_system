<?php
namespace app\modules\v1\controllers;
use app\modules\v1\controllers\parent\ParentController;
use app\models\User;
use app\config\Status;
use yii\data\ActiveDataProvider;
use app\customLibrary\ActionTool;
class UserController extends ParentController
{
    /**
     * @return ActiveDataProvider
     */
    public function actionIndex(){
        $params = \Yii::$app->request->getQueryParams();
        $query = User::find();
        if(isset($params['username']))
            $query->andWhere(['like','username', $params['username']]);
        if(isset($params['name']))
            $query->andWhere(['like','username', $params['name']]);
        return ActionTool::createActiveDataProvider($query,$params);
    }

    /**
     * 根据用户ID请求一个用户的信息
     * @return User|array|null
     */
    public function actionView(){
        $id = \Yii::$app->request->get('id');
        $res = User::find()->where(['id' => $id])->one();
        // 返回处理结果
        return $res;
    }

    /**
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate() {
        $data = \Yii::$app->request->getBodyParams();
        $model = User::findOne($data['id']);
        $model->load($data,'');
        if ($model->save()) {
            return ['bCode' => Status::SUCCESS, 'bData' => $model];
        }
        return ['bCode' => Status::FAIL, 'bData' => $model->errors];
    }

    /**
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdatePassword(){
        $params = \Yii::$app->request->getBodyParams();
        $id = \Yii::$app->user->id;
        $user = User::findOne($id);
        $oldPassword = $params['oldPassword'];
        $password = $params['password'];
        $password2 = $params['password2'];
        if(sha1($oldPassword) !== $user->password){
            return ['bCode' => Status::FAIL, 'bData' => ['msg'=>'原密码错误']];
        }
        if($password !== $password2){
            return ['bCode' => Status::FAIL, 'bData' => ['msg'=>'确认密码不一致']];
        }
        $user->password = sha1($password);
        if($user->save())
            return ['bCode' => Status::SUCCESS, 'bData' => ['msg'=>'密码修改成功']];
        return ['bCode' => Status::FAIL, 'bData' => ['msg'=>'密码修改失败，save执行错误']];
    }

    /**
     * @return User|null|\yii\web\IdentityInterface
     * @throws \Throwable
     */
    public function actionLogout(){
//        $user = User::findOne(\Yii::$app->user->id);
        $user = \Yii::$app->user->identity;
        /** @noinspection PhpUndefinedMethodInspection */
        return $user->updateToken();
    }
}