<?php
/**
 * Created by PhpStorm.
 * User: tony
 * Date: 2018/6/5
 * Time: 10:56
 */

namespace app\config;


class Status
{
    const SUCCESS = 101; //请求正常
    const FAIL = 102; //请求正常
    const FAIL_TOKEN = 0; //授权失败，非法token
}