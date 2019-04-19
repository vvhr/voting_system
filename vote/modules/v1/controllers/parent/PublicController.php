<?php
/**
 * Created by PhpStorm.
 * User: tony
 * Date: 2018/6/4
 * Time: 11:20
 */

namespace app\modules\v1\controllers\parent;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\rest\Controller;
use yii\helpers\ArrayHelper;

class PublicController extends Controller
{
    public $serializer = [
        'class' => 'yii\rest\Serializer',
        // 配置用户自定义输出序列化行为
        'collectionEnvelope' => '_items',
    ];

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
//        $behaviors['authenticator'] = ['class' => HttpBearerAuth::class];
        return $behaviors;
    }

    // 检查要修改的记录的用户ID是不是自己的ID
    public function isMine($user_id){
//        if(\Yii::$app->user->id === $user_id)
            return true;
//        return false;
    }

}