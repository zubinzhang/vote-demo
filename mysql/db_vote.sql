CREATE DATABASE
IF
	NOT EXISTS `db_vote`;
USE db_vote;

-- ----------------------------
-- Table structure for ballot
-- ----------------------------

CREATE TABLE IF
	NOT EXISTS `ballot` (
	`id` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`ballotTime` datetime NOT NULL COMMENT '投票时间',
	`userId` INT ( 11 ) DEFAULT NULL,
	`voteId` INT ( 11 ) DEFAULT NULL,
	PRIMARY KEY ( `id` ),
	KEY `ix_userId` ( `userId` ),
	KEY `ix_voteId` ( `voteId` )
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '投票表';

-- ----------------------------
-- Table structure for ballot_box
-- ----------------------------

CREATE TABLE IF
	NOT EXISTS `ballot_box` (
	`id` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`ballotId` INT ( 11 ) DEFAULT NULL,
	`candidateId` INT ( 11 ) NOT NULL,
	PRIMARY KEY ( `id` ),
	KEY `ix_ballotId` ( `ballotId` ),
	KEY `ix_candidateId` ( `candidateId` )
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '投票箱表';

-- ----------------------------
-- Table structure for candidate
-- ----------------------------
CREATE TABLE IF
	NOT EXISTS `candidate` (
	`id` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR ( 128 ) NOT NULL COMMENT '候选人名称',
	`votes` INT ( 11 ) NOT NULL DEFAULT '0' COMMENT '得票数',
	`voteId` INT ( 11 ) DEFAULT NULL,
	PRIMARY KEY ( `id` ),
	KEY `ix_voteId` ( `voteId` )
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '候选人表';

-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE IF
	NOT EXISTS `user` (
	`id` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR ( 128 ) NOT NULL COMMENT '用户名',
	`password` VARCHAR ( 128 ) NOT NULL COMMENT '密码',
	`email` VARCHAR ( 128 ) NOT NULL COMMENT '邮箱',
	`status` INT ( 1 ) NOT NULL DEFAULT '1' COMMENT '状态（1：待激活 2：已激活）',
	`role` INT ( 1 ) NOT NULL DEFAULT '2' COMMENT '角色（1：工作人员 2：普通用户）',
	PRIMARY KEY ( `id` ),
	KEY `ix_email` ( `email` )
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '用户表';

INSERT INTO `user` VALUES(DEFAULT,"admin","5eeeb748d337e2ec5a33b8f5840e6c3c","admin@qq.com",2,1);

-- ----------------------------
-- Table structure for vote
-- ----------------------------
CREATE TABLE IF
	NOT EXISTS `vote` (
	`id` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR ( 128 ) NOT NULL COMMENT '选举名称',
	`startDate` datetime NOT NULL COMMENT '投票开始时间',
	`endDate` datetime NOT NULL COMMENT '投票截止时间',
PRIMARY KEY ( `id` )
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '选举表';
