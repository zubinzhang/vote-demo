import { inject, provide } from 'midway';
import assert = require('power-assert');

import { ICandidateAttribute, ICandidateModel } from './../model/interface.d';
import { ICandidateService, IVoteService } from './interface';

/**
 * Candidate Service
 *
 * @export
 * @class CandidateService
 * @implements {ICandidateService}
 */
@provide('candidateService')
export default class CandidateService implements ICandidateService {
  @inject('candidateModel')
  candidateModel: ICandidateModel;

  @inject('voteService')
  voteService: IVoteService;

  /**
   * 新增候选人
   *
   * @param {ICandidateAttribute[]} candidateList
   * @returns
   * @memberof CandidateService
   */
  async addCandidates(candidateList: ICandidateAttribute[]): Promise<ICandidateAttribute[]> {
    const isStart = await this.voteService.isStart(candidateList[0].voteId);
    assert(!isStart, '选举已经开始，不能新增候选人');

    const tasks = candidateList.map(candidate => this.addHandler(candidate));

    return Promise.all(tasks);
  }

  private async addHandler(candidate: ICandidateAttribute): Promise<ICandidateAttribute> {
    await this.voteService.isStart(candidate.voteId);

    const result = await this.candidateModel.create(candidate);

    return { id: result.id, name: result.name, votes: result.votes };
  }

  /**
   * 删除候选人
   *
   * @param {number} candidateId 候选人Id
   * @returns {Promise<boolean>}
   * @memberof CandidateService
   */
  async removeCandidate(candidateId: number): Promise<boolean> {
    const condidateInfo = await this.candidateModel.findOne({
      where: { id: candidateId },
      attributes: ['voteId'],
    });
    assert(condidateInfo !== null, 'Invalid candidateId');

    const isStart = await this.voteService.isStart(condidateInfo.voteId);
    assert(!isStart, '选举已经开始，不能删除候选人');

    const result = await this.candidateModel.destroy({ where: { id: candidateId } });
    return result > 0;
  }

  /**
   * 获取候选人信息
   *
   * @param {number} id 候选人Id
   * @returns {Promise<ICandidateAttribute>}
   * @memberof CandidateService
   */
  async getCandidateById(id: number): Promise<ICandidateAttribute> {
    return this.candidateModel.findOne({ raw: true, where: { id } });
  }

  /**
   * 更新候选人信息
   *
   * @param {ICandidateAttribute} value 候选人信息
   * @param {number} candidateId 候选人id
   * @returns {Promise<number>}
   * @memberof CandidateService
   */
  async updateCandidate(values: ICandidateAttribute, candidateId: number): Promise<number> {
    const result = await this.candidateModel.update(values, { where: { id: candidateId } });
    return result[0];
  }

  /**
   * 获取候选人
   *
   * @param {number} voteId 选举Id
   * @returns {Promise<ICandidateAttribute[]>}
   * @memberof CandidateService
   */
  async getCandidatesByVoteId(voteId: number): Promise<ICandidateAttribute[]> {
    return this.candidateModel.findAll({
      raw: true,
      where: { voteId },
      order: [['votes', 'DESC']],
    });
  }

  /**
   * 获取候选人数量
   *
   * @param {number} voteId 选举Id
   * @returns {Promise<ICandidateAttribute[]>}
   * @memberof CandidateService
   */
  async getCandidateCountByVoteId(voteId: number): Promise<number> {
    return this.candidateModel.count({ where: { voteId } });
  }
}
