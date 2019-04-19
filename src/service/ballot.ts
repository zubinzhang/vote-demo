import assert = require('assert');
import { Logger } from 'egg-logger';
import { Redis } from 'ioredis';
import { inject, logger, plugin, provide } from 'midway';
import moment = require('moment');

import DB from '../model/db';
import { IBallotModel, ICandidateModel } from '../model/interface';
import { IBallotBoxModel } from './../model/interface.d';
import { IBallotParam, IBallotService, ICandidateService, IUserService, IVoteService } from './interface.d';

const MIN_BALLOTS = 2; // 最低票数
const MAX_BALLOTS = 5; // 最高票数

/**
 * Ballot service
 *
 * @export
 * @class BallotService
 * @implements {IBallotService}
 */
@provide('ballotService')
export default class BallotService implements IBallotService {
  @inject('ballotModel')
  ballotModel: IBallotModel;

  @inject('ballotBoxModel')
  ballotBoxModel: IBallotBoxModel;

  @inject('candidateModel')
  candidateModel: ICandidateModel;

  @inject('userService')
  userService: IUserService;

  @inject('candidateService')
  candidateService: ICandidateService;

  @inject('voteService')
  voteService: IVoteService;

  @plugin()
  redis: Redis;

  @inject('voteDB')
  db: DB;

  @logger()
  logger: Logger;

  /**
   * 投票
   *
   * @param {IBallotParam} value
   * @returns {Promise<void>}
   * @memberof BallotService
   */
  async ballot(value: IBallotParam): Promise<void> {
    // 验证邮箱后才可以投票
    await this.userService.checkUserActive(value.userId);

    // 是否重复投票
    const isRepeat = await this.isRepeat(value);
    assert(!isRepeat, '禁止重复投票');

    // 选举是否已经开始或者结束
    const voteInfo = await this.voteService.getVoteById(value.voteId);
    assert(moment().isAfter(voteInfo.startDate), '选举活动尚未开始');
    assert(moment().isBefore(voteInfo.endDate), '选举活动已经结束');

    // 校验票数
    await this.checkCandidates(value.candidateList, value.voteId);

    const trans = await this.db.sequelize.transaction();
    try {
      // 保存投票信息
      const ballotInfo = await this.ballotModel.create(
        {
          ballotTime: new Date(),
          userId: value.userId,
          voteId: value.voteId,
        },
        {
          transaction: trans,
        }
      );

      const tasks = value.candidateList.map(candidateId =>
        this.ballotHandler(
          {
            candidateId,
            ballotId: ballotInfo.id,
          },
          trans
        )
      );
      await Promise.all(tasks);

      await trans.commit();
    } catch (error) {
      this.logger.error('投票失败：', error);
      await trans.rollback();
      await this.redis.del(`ballot:${value.voteId}:userId:${value.userId}`);
      throw new Error('投票失败');
    }

    await this.redis.set(
      `ballot:${value.voteId}:userId:${value.userId}`,
      moment().format('YYYY-MM-DD HH:mm:ss')
    );
  }

  /**
   * 是否重复投票
   *
   * @param {IBallotParam} value
   * @returns {Promise<boolean>}
   * @memberof BallotService
   */
  async isRepeat(value: IBallotParam): Promise<boolean> {
    // redis记录用户投票投票记录
    const rows = await this.redis.exists(`ballot:${value.voteId}:userId:${value.userId}`);
    this.logger.info(`是否重复投票-voteId:${value.voteId},userId:${value.userId},rows:${rows}`);
    let isMulti = rows > 0;

    // redis无记录,查询数据库
    if (!isMulti) {
      const count = await this.ballotModel.count({
        where: { userId: value.userId, voteId: value.voteId },
      });
      this.logger.info(
        `是否重复投票-voteId:${value.voteId},userId:${value.userId},db count:${count}`
      );

      isMulti = count > 0;
    }

    return isMulti;
  }

  private async ballotHandler({ candidateId, ballotId }, trans) {
    const candidateInfo = await this.candidateService.getCandidateById(candidateId);
    assert(candidateInfo !== null, '无效的候选人');

    // 保存投票箱信息
    this.ballotBoxModel.create(
      {
        candidateId,
        ballotId,
      },
      {
        transaction: trans,
      }
    );

    // 更新票数
    await this.candidateModel.update(
      { votes: candidateInfo.votes + 1 },
      { where: { id: candidateId }, transaction: trans }
    );
  }

  private async checkCandidates(candidates: number[], voteId: number): Promise<void> {
    const candidatesCount = await this.candidateService.getCandidateCountByVoteId(voteId);

    // 可投票数为候选人数量的一半
    const halfCandidatesCount = Math.floor(candidatesCount / 2);
    assert(halfCandidatesCount >= MIN_BALLOTS, `可投票数少于${MIN_BALLOTS}人,投票无效`);

    const maxVotes = Math.min(MAX_BALLOTS, halfCandidatesCount);
    assert(
      candidates.length >= MIN_BALLOTS && candidates.length <= maxVotes,
      `可投票数不少于${MIN_BALLOTS}人，不多于${maxVotes}人`
    );
  }
}
