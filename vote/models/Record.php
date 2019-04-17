<?php

namespace app\models;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "record".
 *
 * @property int $id
 * @property int $theme_id
 * @property string $create_time
 * @property int $user_id
 * @property string $user_ip
 */
class Record extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'record';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['theme_id', 'user_id'], 'integer'],
            [['create_time', 'user_ip'], 'string'],
        ];
    }
}