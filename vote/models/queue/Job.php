<?php

namespace app\models\queue;

use yii\base\BaseObject;
use yii\queue\JobInterface;

/**
 * Each task which is sent to the queue should be defined as a separate class.
 * For example, if you need to write and save a file the class may look like the following:
*/
class Job extends BaseObject implements JobInterface
{
    public $text;
    public $file;

    /*回调执行工作的函数定义*/
    public function execute($queue)
    {
        $pre_text = file_get_contents($this->file);
        file_put_contents($this->file, $this->text.$queue->getWorkerPid()."\r\n".$pre_text);
    }
}
