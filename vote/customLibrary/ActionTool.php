<?php
/**
 * Created by PhpStorm.
 * User: tony
 * Date: 2018-12-25
 * Time: 10:41
 */

// 顶级命名空间可直接使用 app。这个顶级命名空间在框架中已经放入了映射数组
namespace app\customLibrary;

use app\models\User;
use yii\data\ActiveDataProvider;
use yii\db\ActiveQuery;

final class ActionTool
{
    /**
     * 根据expand参数给query添加with关系
     * @param ActiveQuery $query
     * @param array $params
     * @param array $joinRelations
     */
    public static function addWithRelation(ActiveQuery $query,  array $params, array $joinRelations=['relationName'=>['tableName'=>null,'fieldName'=>null,'operator'=>'=']] ){
        if(isset($params['expand'])){
            $splicedExpandParam = explode(',', $params['expand']);
            foreach ($splicedExpandParam as $relation){
                // 最后一个参数指定了必须使用joinWith进行关联的关系。同时指定了joinWith关联时使用的查询条件
                if(key_exists($relation, $joinRelations)){
                    $conditionMeta = $joinRelations[$relation];
                    $query->joinWith($relation);
                    if(isset($params[$conditionMeta['fieldName']])){
                        $operator = $conditionMeta['operator'];
                        $fieldName = $conditionMeta['tableName'].'.'.$conditionMeta['fieldName'];
                        $queryValue = $params[$conditionMeta['fieldName']];
                        $query->andFilterWhere([$operator, $fieldName, $queryValue]);
                    }
                }
                // 如果不在指定范围内，则直接使用with的进行关联
                else
                    $query->with($relation);
            }
        }
    }


    /**
     * 创造数据提供者
     * @param ActiveQuery $query
     * @param array $params
     * @return ActiveDataProvider
     */
    public static function createActiveDataProvider(ActiveQuery $query, array $params){
        // 设备默认每页多少条
        $pageSize = 20;
        if(isset($params['pageSize'])){
            $pageSize = (int)$params['pageSize'];
        }
        // 默认排序
        $sort_name='id';
        $sort=3;
        if(isset($params['sort_name']) && isset($params['sort'])){
            $sort_name = $params['sort_name'];
            $sort = (int)$params['sort'];
        }
        return new ActiveDataProvider([
            // 使用with方法实现贪加载
            'query' => $query,
            // 分页信息
            'pagination' => [
                'pageSize' => $pageSize,
            ],
            // 排序信息
            'sort' => [
                'defaultOrder' => [
                    $sort_name => $sort
                ]
            ],
        ]);
    }
}