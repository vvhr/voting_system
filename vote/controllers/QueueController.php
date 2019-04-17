<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\models\queue\Job;
use yii\queue\Queue;


class QueueController extends Controller
{
    public function actionIndex(){
        var_dump('this is a queue test!');
    }
    public function actionPush(){
        //队列事件
        Yii::$app->queue->on(Queue::EVENT_BEFORE_PUSH, function ($event) {
            var_dump('start push');
        });
        $id = Yii::$app->queue->push(new Job([
            'text' =>'['. date('Y-m-d H:i:s').']',
            //'file' => '/tmp/queueJob.txt',
            'file' => 'C:/wamp64/www/yiidemo/basic/runtime/queueJob.txt',
        ]));
        //Yii::$app->queue->clear();

        echo '<pre>';

        /*查看任务状态,Waring:The RabbitMQ and AWS SQS drivers don't support job statuses.*/
        //任务ID
        var_dump('job_id:',$id);
        //任务是否处于等待状态
        var_dump('whether the job is waiting for execution:',Yii::$app->queue->isWaiting($id));
        //任务是否已经被获取并正在执行
        var_dump('whether a worker got the job from the queue and executes it:',Yii::$app->queue->isReserved($id));
        //任务是否已经完成执行
        var_dump('whether a worker has executed the job:',Yii::$app->queue->isDone($id));
        var_dump('使用console控制台-命令行执行Job:yii queue/run,同时必须在console.php配置redis,queue相关组件配置，否则命令不能执行');

        echo '</pre>';

    }



}
