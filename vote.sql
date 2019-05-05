/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50714
 Source Host           : localhost:3306
 Source Schema         : vote

 Target Server Type    : MySQL
 Target Server Version : 50714
 File Encoding         : 65001

 Date: 06/05/2019 03:53:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for record
-- ----------------------------
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID索引',
  `theme_id` int(11) NOT NULL COMMENT '投票主题ID',
  `create_time` datetime(0) DEFAULT NULL COMMENT '投票时间',
  `user_id` int(11) DEFAULT NULL COMMENT '投票用户',
  `user_ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '投票用户的IP',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of record
-- ----------------------------
INSERT INTO `record` VALUES (2, 4, '2019-05-06 03:36:44', 0, '122.190.210.252');
INSERT INTO `record` VALUES (3, 4, '2019-05-06 03:41:03', 2, '122.190.210.254');
INSERT INTO `record` VALUES (4, 4, '2019-05-06 03:43:07', 0, '122.190.210.255');
INSERT INTO `record` VALUES (5, 4, '2019-05-06 03:43:13', 0, '122.190.210.256');
INSERT INTO `record` VALUES (6, 4, '2019-05-06 03:43:19', 0, '122.190.210.257');
INSERT INTO `record` VALUES (7, 4, '2019-05-06 03:49:17', 0, '122.190.210.253');

-- ----------------------------
-- Table structure for theme
-- ----------------------------
DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `theme_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '投票主题名称',
  `theme_content` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '主题说明',
  `creater_id` int(11) DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime(0) DEFAULT NULL COMMENT '创建时间',
  `end_time` datetime(0) DEFAULT NULL COMMENT '截止时间',
  `state` int(11) DEFAULT NULL COMMENT '主题状态( 0: 待开启 1: 投票中 2: 已完成 3: 已取消)',
  `votes_max` int(11) DEFAULT NULL COMMENT '限制总投票数',
  `options_count` int(11) DEFAULT NULL COMMENT '选项数量',
  `options_type` int(11) DEFAULT NULL COMMENT '选择类型( 0: 单选 1: 可多选)',
  `choose_max` int(11) DEFAULT NULL COMMENT '多选最大选择数',
  `voted_total` int(11) DEFAULT NULL COMMENT '已投票总数',
  `options_content` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT 'JSON存储选项内容/已投票数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of theme
-- ----------------------------
INSERT INTO `theme` VALUES (4, '您一般在什么时间睡觉？', '本投票用以调查统计各位的睡觉时间，每人尽可投票一次，本投票秉承公平公正，数据仅供私下研究学习，我们将保障您的隐私安全。', 2, '2019-05-06 00:00:00', '2019-05-31 00:00:00', 2, 6, 6, 0, 1, 6, '[{\"name\":\"晚上8点或更早\",\"number\":1},{\"name\":\"晚上8点-9点30\",\"number\":1,\"key\":1557084908438},{\"name\":\"晚上9点30-10点30\",\"number\":1,\"key\":1557084939120},{\"name\":\"晚上10点30-11点30\",\"number\":0,\"key\":1557084945621},{\"name\":\"晚上11点30-凌晨1点\",\"number\":1,\"key\":1557084954960},{\"name\":\"凌晨1点后\",\"number\":2,\"key\":1557084970449}]');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '索引ID',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `token_expired_time` int(11) DEFAULT NULL COMMENT '令牌更新时间',
  `token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '临时令牌',
  `created_at` int(11) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '管理员', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1528881894, '281d0febbeb57f872fb407c7e0a86ff1cbcff962', 1528880094);
INSERT INTO `user` VALUES (2, 'chenlian', '陈炼', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1556962930, '3d8ddcdf7616fc51618a641a50d5bf0323ed157c', 1556961130);

SET FOREIGN_KEY_CHECKS = 1;
