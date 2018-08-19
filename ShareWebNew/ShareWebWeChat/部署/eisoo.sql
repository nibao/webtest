/*
Navicat MySQL Data Transfer

Source Server         : Eisoo
Source Server Version : 50518
Source Host           : rds4hgoeipzfvvkypqrlu.mysql.rds.aliyuncs.com:3306
Source Database       : eisoo

Target Server Type    : MYSQL
Target Server Version : 50518
File Encoding         : 65001

Date: 2015-07-15 14:06:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `winter_collect_info`
-- ----------------------------
DROP TABLE IF EXISTS `winter_collect_info`;
CREATE TABLE `winter_collect_info` (
  `id` varchar(32) NOT NULL,
  `user` varchar(32) NOT NULL,
  `type` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_winter_collect_info_time` (`time`),
  KEY `ix_winter_collect_info_type` (`type`),
  KEY `ix_winter_collect_info_user` (`user`),
  KEY `ix_winter_collect_info_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of winter_collect_info
-- ----------------------------

-- ----------------------------
-- Table structure for `winter_config`
-- ----------------------------
DROP TABLE IF EXISTS `winter_config`;
CREATE TABLE `winter_config` (
  `key` varchar(64) NOT NULL,
  `value` varchar(511) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of winter_config
-- ----------------------------
INSERT INTO `winter_config` VALUES ('anyshare_account_size', '用户名：    %s \r\n总配额空间：%sGB\r\n已用空间：%sGB');
INSERT INTO `winter_config` VALUES ('anyshare_common_problem', '<a href=\'http://www.eisoo.com/cn/shareblog/\'>点击查看常见问题</a>');
INSERT INTO `winter_config` VALUES ('anyshare_folder_name', '微信收藏');
INSERT INTO `winter_config` VALUES ('as_html_title', '文章');
INSERT INTO `winter_config` VALUES ('as_html_url', 'http://as-winter.oss-cn-hangzhou.aliyuncs.com/document_logo/document.png');
INSERT INTO `winter_config` VALUES ('as_mp3_title', '音频');
INSERT INTO `winter_config` VALUES ('as_mp3_url', 'http://as-winter.oss-cn-hangzhou.aliyuncs.com/document_logo/voice.png');
INSERT INTO `winter_config` VALUES ('as_mp4_title', '视频');
INSERT INTO `winter_config` VALUES ('as_mp4_url', 'http://as-winter.oss-cn-hangzhou.aliyuncs.com/document_logo/video.png');
INSERT INTO `winter_config` VALUES ('as_png_title', '图片');
INSERT INTO `winter_config` VALUES ('as_png_url', 'http://as-winter.oss-cn-hangzhou.aliyuncs.com/document_logo/picture.png');
INSERT INTO `winter_config` VALUES ('wechat_appid', 'wxe931e43ea8295b5e');
INSERT INTO `winter_config` VALUES ('wechat_appsecret', 'cf6555521019a15815091718978169c7');
INSERT INTO `winter_config` VALUES ('wechat_attention_push', '绑定账号即可将微信上的文章、图片、音频、视频保存至云盘，也可以通过微信阅读微信收藏！\n<a href=\'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe931e43ea8295b5e&redirect_uri=http://weixin.eisoo.com/user/wechat/authority&response_type=code&scope=snsapi_base#wechat_redirect\'>点击绑定账号</a>');
INSERT INTO `winter_config` VALUES ('wechat_binded', '账号已绑定! \r\n<a href=\'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe931e43ea8295b5e&redirect_uri=http%3A%2F%2Fweixin.eisoo.com%2Fuser%2Fwechat%2Fauthority&response_type=code&scope=snsapi_base#wechat_redirect\'>点击重新绑定账号</a>');
INSERT INTO `winter_config` VALUES ('wechat_bind_hint', '请您先绑定账号!  <a href=\'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe931e43ea8295b5e&redirect_uri=http%3A%2F%2Fweixin.eisoo.com%2Fuser%2Fwechat%2Fauthority&response_type=code&scope=snsapi_base#wechat_redirect\'>点击绑定账号</a>');
INSERT INTO `winter_config` VALUES ('wechat_checked_failed', '您还未通过微信收藏任何内容！');
INSERT INTO `winter_config` VALUES ('wechat_how_collect', '★保存对话框中的图片、文章，只需要长按，选择\"更多\"，再按右下角的\"...\",选择AnyShare图标即可！<a href=\"http://mp.weixin.qq.com/s?__biz=MzAxODE4NDA5MA==&mid=203840596&idx=1&sn=558cfdb68ad89b18dc9d1a7781a29b05#rd\">看示例</a>\n★保存公众号的文章，只需要点击右上角的\"...\"，选择AnyShare图标即可！');
INSERT INTO `winter_config` VALUES ('wechat_menu_contact_us', '您好，如果您有任何问题请拨打: 4008801569，我们的服务时间：上午8:30-12:00，下午13:00-17:00。');
INSERT INTO `winter_config` VALUES ('wechat_more_files_msg', '<a href=\'%s\'>点击查看更多</a>');
INSERT INTO `winter_config` VALUES ('wechat_save_failed', '对不起，暂时不支持此内容保存！');
INSERT INTO `winter_config` VALUES ('wechat_save_successed', '已将文件收藏到个人文档下的“微信收藏”目录下。');
INSERT INTO `winter_config` VALUES ('wechat_text_hint', '★输入“S”了解如何收藏；★输入“W”查看已收藏；★输入“H”获取售后电话；');
INSERT INTO `winter_config` VALUES ('wechat_token', 'ANYSHARE_WECHAT201501_TOKEN');

-- ----------------------------
-- Table structure for `winter_token`
-- ----------------------------
DROP TABLE IF EXISTS `winter_token`;
CREATE TABLE `winter_token` (
  `id` varchar(32) NOT NULL,
  `data` varchar(32) NOT NULL,
  `expire` datetime NOT NULL,
  PRIMARY KEY (`data`),
  UNIQUE KEY `ix_winter_token_id` (`id`),
  KEY `ix_winter_token_expire` (`expire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


-- ----------------------------
-- Table structure for `winter_user_anyshare`
-- ----------------------------
DROP TABLE IF EXISTS `winter_user_anyshare`;
CREATE TABLE `winter_user_anyshare` (
  `id` varchar(32) NOT NULL,
  `account` varchar(128) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `server_addr` varchar(128) DEFAULT NULL,
  `right_port` int(11) DEFAULT NULL,
  `file_port` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for `winter_user_info`
-- ----------------------------
DROP TABLE IF EXISTS `winter_user_info`;
CREATE TABLE `winter_user_info` (
  `id` varchar(32) NOT NULL,
  `nickname` varchar(64) DEFAULT NULL,
  `cellphone` varchar(16) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


-- ----------------------------
-- Table structure for `winter_wechat_bind`
-- ----------------------------
DROP TABLE IF EXISTS `winter_wechat_bind`;
CREATE TABLE `winter_wechat_bind` (
  `openid` varchar(64) NOT NULL,
  `id` varchar(32) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
