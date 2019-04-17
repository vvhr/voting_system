<?php
/**
 * Created by PhpStorm.
 * User: tony
 * Date: 2018-12-25
 * Time: 10:41
 */

// 顶级命名空间可直接使用 app。这个顶级命名空间在框架中已经放入了映射数组
namespace app\customLibrary;

final class ReturnTool
{
    /**
     * 用于post方法的返回规范
     * @param int $code
     * @param $data // 响应数据
     * @param String $msg
     * @return array
     */
    public static function returnPostMsg(int $code, $data, String $msg){
        return [
            'bCode' => $code,
            'bData' => $data,
            'bMsg' => $msg
        ];
    }
}