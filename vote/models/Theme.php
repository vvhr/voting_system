<?php

namespace app\models;

use yii\db\ActiveRecord;
/**
 * This is the model class for table "theme".
 *
 * @property int $id
 * @property string $theme_name
 * @property string $theme_content
 * @property int $creater_id
 * @property string $create_time
 * @property string $end_time
 * @property int $state
 * @property int $votes_max
 * @property int $options_count
 * @property int $options_type
 * @property int $choose_max
 * @property int $voted_total
 * @property string $options_content
 */
class Theme extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'theme';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['creater_id', 'state', 'votes_max','options_count','options_type','choose_max','voted_total'], 'integer'],
            [['theme_content', 'theme_name', 'create_time', 'end_time', 'options_content'], 'string'],
        ];
    }

    /** 建立关联关系 */
    public function getUser(){
        return $this->hasOne(User::class,['id'=>'creater_id']);
    }

    /** 定义额外字段,返回关联模型 */
    public function extraFields()
    {
        $fields['user'] = function ($model){
            return $model->user;
        };
        return $fields;
    }
}