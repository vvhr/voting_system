<?php

namespace app\models;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

/**
 * @property mixed id
 * @property string username 用户名
 * @property string name 真实姓名
 * @property string password 登录密码
 * @property string token 临时令牌
 * @property int created_at 创建时间
 * @property int token_expired_time 令牌过期时间
 */
class User extends ActiveRecord implements IdentityInterface
{
    public static function tableName()
    {
        return 'user';
    }
    /** ------------------------- 验证规则，字段输入输出规则  -------------------------------*/
    // 使用load 与 save 方法时此规则会起作用
    // 此规则必须配置，否则字段不能load到模型的属性。
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['username', 'password'], 'required'],
            [['id'], 'integer'],
            [['username', 'password', 'name', 'token'], 'string', 'max' => 255],
            [['username'], 'unique'],
            ];
    }

    /**
     * 模型字段过滤器。当它配合数据处理器对象时，会起效
     * @return array
     */
    public function fields()
    {
        $fields = parent::fields();
        unset($fields['password'],$fields['token'],$fields['token_expired_time']);
        return $fields;
    }

    public function scenarios()
    {
        $scenarios = parent::scenarios(); // TODO: Change the autogenerated stub
        $scenarios['update'] = $scenarios['default'];
        unset( $scenarios['update']['id'],$scenarios['update']['username'],$scenarios['update']['password']);
        return $scenarios;
    }
    /**----------------------------用户自定义资源获取与操作方法---------------------------------------------*/
    /**
     * @return bool
     */
    public function create(){
        // 这两种加密方法太慢
//        $this->token = Yii::$app->security->generateRandomString().'_'.time();
//        $this->password = Yii::$app->getSecurity()->generatePasswordHash($this->password);
        $this->token = sha1(time().mt_rand(0,1000));
        $this->password = sha1($this->password);
        $this->created_at = time();
        $this->token_expired_time = $this->created_at + 1800;
        if($this->save())
            return true;
        return false;
    }

    /**
     * 当token过期时，重新改变token
     */
    public function updateToken(){
        $this->token = sha1(time().mt_rand(0,1000));
        $this->token_expired_time = $this->created_at + 1800;
        $this->save();
    }

    /**
     * 每次访问token续期半小时
     */
    public function updateTokenExpiredTime(){
        $this->token_expired_time += 1800;
        $this->save();
    }

    /**
     * @param $username
     * @param $password
     * @return string
     */
    public static function getToken($username,$password){
        $password = sha1($password);
        $res = User::findOne(['username'=>$username,'password'=>$password]);
        if($res)
            return $res->token;
        return null;
    }
/**-----------------------实现接口----------------------------------------------*/

    /**
     * @param mixed $token
     * @param null $type
     * @return User|null|IdentityInterface
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        // TODO: Implement findIdentityByAccessToken() method.
        return User::findOne(['token' => $token]);
    }

    /**
     * @param int|string $id
     * @return User|null|IdentityInterface
     */
    public static function findIdentity($id)
    {
        // TODO: Implement findIdentity() method.
        return User::findOne($id);
    }

    /**
     * @return int|mixed|string
     */
    public function getId()
    {
        // TODO: Implement getId() method.
        return $this->id;
    }

    /**
     * @return string|void
     */
    public function getAuthKey()
    {
        // TODO: Implement getAuthKey() method.
    }

    /**
     * @param string $authKey
     * @return bool|void
     */
    public function validateAuthKey($authKey)
    {
        // TODO: Implement validateAuthKey() method.
    }
}
