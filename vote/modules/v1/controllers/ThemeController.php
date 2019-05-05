<?php


namespace app\modules\v1\controllers;
use app\config\Status;
use app\models\Record;
use app\models\Theme;
use app\modules\v1\controllers\parent\ParentController;
use app\customLibrary\ActionTool;

class ThemeController extends ParentController
{
    /**
     * @return \yii\data\ActiveDataProvider
     */
    public function actionIndex(){
        // 获取查询参数
        $params = \Yii::$app->request->getQueryParams();
        // 执行查询
        $query = Theme::find()->joinWith('user');
        // 添加查询条件
        // - 查询主题名称 , 模糊查询
        if (isset($params['theme_name']))
            $query->andWhere(['like', 'theme_name', $params['theme_name']]);
        // - 查询主题状态
        if (isset($params['state']))
            $query->andWhere(['state' => $params['state']]);
        // - 查询创建者
        if (isset($params['creater_id']))
            $query->andWhere(['creater_id' => $params['creater_id']]);
        // 返回查询结果
        return ActionTool::createActiveDataProvider($query,$params);
    }

    /**
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate(){
        // 获取请求数据
        $data = \Yii::$app->request->getBodyParams();
        // 创建主题模型
        $theme = new Theme();
        // 加载数据到模型
        $theme->load($data, '');
        // 重新加载选项内容
        $theme->options_content = $data['options_JSON'];
        // 初始化部分属性
        $theme->voted_total=0;
        // 保存并返回
        if ($theme->save()) {
            return ['bCode' => Status::SUCCESS, 'bData' => $theme];
        }
        return ['bCode' => Status::FAIL, 'bData' => $theme->errors];
    }

    /**
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate(){
        // 获取请求数据
        $data = \Yii::$app->request->getBodyParams();
        // 通过id查找该主题
        $theme = Theme::findOne(['id'=>$data['id']]);
        // 加载数据到模型
        $theme->load($data, '');
        // 仅当投票未启动时可修改选项内容
        if ($data['state']===0) {
            $theme->options_content = $data['options_JSON'];
        }
        // 保存并返回
        if ($theme->save()) {
            return ['bCode' => Status::SUCCESS, 'bData' => $theme];
        }
        return ['bCode' => Status::FAIL, 'bData' => $theme->errors];
    }

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
        // 判断投票人ID是否已在record表中
        if (isset($data['user_id'])) {
            $records = Record::find()
                ->where(['theme_id'=>$theme['id']])
                ->andWhere(['user_id'=>$data['user_id']])
                ->all();
            if ($records) {
                return ['bCode' => Status::FAIL, 'bData' => '该用户已投过票！'];
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
            $record->user_id=$data['user_id'];
            $record->user_ip=$data['user_ip'];
            $record->save();
            return ['bCode' => Status::SUCCESS, 'bData' => '投票成功'];
        }
        return ['bCode' => Status::FAIL, 'bData' => $theme->errors];
    }
}