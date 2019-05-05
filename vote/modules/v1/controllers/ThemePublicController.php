<?php


namespace app\modules\v1\controllers;
use app\config\Status;
use app\models\Record;
use app\models\Theme;
use app\modules\v1\controllers\parent\ParentController;
use app\customLibrary\ActionTool;
use app\modules\v1\controllers\parent\PublicController;

class ThemePublicController extends PublicController
{
    /**
     * @return array|\yii\db\ActiveRecord|null
     */
    public function actionView() {
        // 获取查询参数
        $params = \Yii::$app->request->getQueryParams();
        // 执行查询
        $query = Theme::find()->where(['theme.id'=>$params['id']])->joinWith('user')->one();
        // 返回查询结果
        return $query;
    }

    /**
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionVoting() {
        // 获取请求数据
        $data = \Yii::$app->request->getBodyParams();
        // 通过id查找该主题
        $theme = Theme::findOne(['id'=>$data['theme_id']]);
        // 判断投票人IP是否已在record表中
        if (isset($data['user_ip'])) {
            $records = Record::find()
                ->where(['theme_id'=>$theme['id']])
                ->andWhere(['user_ip'=>$data['user_ip']])
                ->all();
            if ($records) {
                return ['bCode' => Status::FAIL, 'bData' => '该IP已投过票！'];
            }
        }
        // 加载投票数据
        $theme->options_content = $data['options_JSON'];
        // 更新已投票总数
        $theme->voted_total = $data['voted_total'];
        // 判断是否已完成投票
        if ($theme->voted_total >= $theme->votes_max) {
            $theme->state=2;
        }
        // 保存并返回
        if ($theme->save()) {
            // 保存成功则生成投票记录
            $record = new Record();
            $record->theme_id=$theme['id'];
            $record->create_time=$data['create_time'];
            $record->user_id=0;
            $record->user_ip=$data['user_ip'];
            $record->save();
            return ['bCode' => Status::SUCCESS, 'bData' => '投票成功'];
        }
        return ['bCode' => Status::FAIL, 'bData' => $theme->errors];
    }
}