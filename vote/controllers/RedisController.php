<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\models\Redis;

class RedisController extends Controller
{
    public function actionIndex(){
        echo 'this is Redis test';
    }

    public function actionHash(){
        echo '<pre>';
        var_dump('this is a hash data structure test:');
        $redis = Yii::$app->redis;
//        $result = $redis->executeCommand('hmset', ['test_collection', 'key1', 'val1', 'key2', 'val2']);
//        $result = $redis->hmset('test_collection', 'key1', 'val1', 'key2', 'val2');
        $result = $redis->hgetall('test_collection');
        var_dump('hgetall',$result);
        echo '</pre>';
    }
    public function actionActiveRecord()
    {
        echo '<pre>';
        // 使用 AR 方式新增一条记录
        $redis = new Redis();
        $redis->name = 'marko';
        $redis->age = 18;
        $redis->phone = 13888888888;
        $redis->status = 1;
        $redis->save();
        var_dump('$redis->id',$redis->id);

        // 使用 AR 查询
        $redis = Redis::findOne($redis->id);
        $redis = Redis::find()->asArray()->where(['status' => 1])->all();
        var_dump($redis);
        echo '</pre>';

    }
}
