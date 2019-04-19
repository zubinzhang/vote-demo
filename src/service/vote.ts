import { inject, provide } from 'midway';
import * as moment from 'moment';
import assert = require('power-assert');

import { ICandidateModel, IVoteAttribute, IVoteModel } from '../model/interface';
import { IGetAllVotesResult, IVoteService } from './interface';

/**
 * Vote Service
 *
 * @export
 * @class VoteService
 * @implements {IVoteService}
 */
@provide('voteService')
export default class VoteService implements IVoteService {
  @inject('voteModel')
  voteModel: IVoteModel;

  @inject('candidateModel')
  candidateModel: ICandidateModel;

  /**
   * 新增选举活动
   *
   * @param {IVoteAttribute} vote
   * @returns {Promise<IVoteAttribute>}
   * @memberof VoteService
   */
  async createVote(vote: IVoteAttribute): Promise<IVoteAttribute> {
    return this.voteModel.create(vote);
  }

  /**
   * 更新选举活动
   *
   * @param {IVoteAttribute} vote
   * @param {number} voteId
   * @returns
   * @memberof VoteService
   */
  async updateVote(vote: IVoteAttribute, voteId: number): Promise<boolean> {
    const result = await this.voteModel.update(vote, { where: { id: voteId } });
    return result[0] > 0;
  }

  /**
   * 选举活动是否已开始
   *
   * @param {number} voteId 选举Id
   * @returns {Promise<void>}
   * @memberof VoteService
   */
  async isStart(voteId: number): Promise<boolean> {
    const vote = await this.voteModel.findOne({
      raw: true,
      where: { id: voteId },
      attributes: ['startDate'],
    });
    assert(vote !== null, 'Invalid voitId');

    return moment().isAfter(vote.startDate);
  }

  /**
   * 获取所有的选举活动
   *
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<IVoteAttribute[]>}
   * @memberof VoteService
   */
  async getAllVotes(limit: number, offset: number): Promise<IGetAllVotesResult> {
    return this.voteModel.findAndCountAll({
      include: [
        { model: this.candidateModel, attributes: ['id', 'name', 'votes'], required: false },
      ],
      limit,
      offset,
    });
  }

  /**
   * 获取选举活动信息
   *
   * @param {number} id 选举活动id
   * @returns {Promise<IVoteAttribute>}
   * @memberof VoteService
   */
  async getVoteById(id: number): Promise<IVoteAttribute> {
    return this.voteModel.findOne({
      include: [
        { model: this.candidateModel, attributes: ['id', 'name', 'votes'], required: false },
      ],
      where: { id },
    });
  }
}
