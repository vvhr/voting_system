<?php


namespace app\modules\v1\controllers;
use app\models\Theme;
use app\modules\v1\controllers\parent\ParentController;
use app\customLibrary\ActionTool;

class ThemeController extends ParentController
{
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
}