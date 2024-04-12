# Host: localhost  (Version: 5.7.26)
# Date: 2024-01-06 00:46:31
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "project"
#

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '项目名称',
  `textContent` text COMMENT '原文',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `status` int(11) DEFAULT NULL COMMENT '状态(初始化，分段落，分词，提示词，音频，图片，完成)',
  `draft` varchar(255) DEFAULT NULL COMMENT '草稿地址',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=utf8 COMMENT='项目表';

#
# Structure for table "setting"
#

CREATE TABLE `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `key` varchar(255) DEFAULT NULL COMMENT '设置项',
  `value` varchar(255) DEFAULT NULL COMMENT '设置值',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COMMENT='全局配置';

#
# Data for table "setting"
#


#
# Structure for table "text"
#

DROP TABLE IF EXISTS `text`;
CREATE TABLE `text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL COMMENT '项目id',
  `content` text COMMENT '文本内容',
  `split` text COMMENT '分词',
  `prompt` text COMMENT '提示词(译文)',
  `image` varchar(500) DEFAULT NULL COMMENT '图片地址',
  `audio` varchar(500) DEFAULT NULL COMMENT '音频地址',
  `audio_duration` varchar(255) DEFAULT NULL COMMENT '音频时长',
  `status` int(11) DEFAULT NULL COMMENT '状态（分词，提示词，图片，音频，完成）',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=725 DEFAULT CHARSET=utf8 COMMENT='文本表';


INSERT INTO `setting` VALUES (1,'websocket端口号','websocket_port','3001'),(2,'api端口号','api_port','3000'),(3,'gpt密钥accesskey','gpt_accesskey',''),(4,'gpt地址url','gpt_url',''),(5,'gpt提示语提示前缀','gpt_prompt_prefix','单词翻译为英语，逗号分割：'),(6,'阿里云音频合成accessKeyId','aliyun_accessKeyId',''),(7,'阿里云音频合成accessKeySecret','aliyun_accessKeySecret',''),(8,'阿里云音频合成appkey','aliyun_appkey',''),(9,'阿里云音频合成讲述者','aliyun_voice','zhimiao_emo'),(10,'阿里云音频合成语速','aliyun_speech_rate','80'),(11,'阿里云音频合成情感','aliyun_emotion','story'),(12,'stable_diffusion服务地址(可远程)','stable_diffusion_url','http://127.0.0.1:7860'),(13,'stable_diffusion配图宽度','image_width','800'),(14,'stable_diffusion配图高度','image_height','450'),(15,'stable_diffusion插件LORA','image_lora',''),(16,'stable_diffusion反向提示词','image_negative_prompt',''),(17,'stable_diffusion生成步数','image_steps','20'),(18,'stable_diffusion提示词相关性','image_cfg_scale','7'),(19,'stable_diffusion平铺','image_tiling','0'),(20,'stable_diffusion采样方法','image_sampler_name','Euler a'),(21,'stable_diffusion高清修复','image_enable_hr','0'),(22,'stable_diffusion放大算法','image_hr_upscaler','Latent'),(23,'stable_diffusion放大倍数','image_hr_scale','2'),(24,'stable_diffusion面部修复','image_restore_faces','0'),(25,'stable_diffusion模型','image_model',''),(26,'剪映缓存地址(一般为草稿文件夹所在磁盘)','draft_removable_storage_device','D:'),(27,'剪映草稿文件夹','draft_root_path','D:/JianyingPro Drafts/');
