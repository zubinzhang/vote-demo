import { Context, controller, del, get, inject, post, provide } from 'midway';

import { ICandidateService, IVoteService } from '../../service/interface';
import VoteValidator from '../validator/vote';

@provide()
@controller('/v1/votes')
export class VoteController {
  @inject('voteService')
  voteService: IVoteService;
  @inject('candidateService')
  candidateService: ICandidateService;

  @inject('voteValidator')
  voteValidator: VoteValidator;

  /**
   * 查看所有选举活动
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof VoteController
   */
  @get('/', { middleware: ['jwtAuth'] })
  async getAllVotes(ctx: Context): Promise<void> {
    const param = this.voteValidator.getAllVotes(ctx.request.query);
    ctx.body = await this.voteService.getAllVotes(param.limit, param.offset);
  }

  /**
   * 新增选举活动
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof VoteController
   */
  @post('/', { middleware: ['jwtAuth', 'admin'] })
  async addVotes(ctx: Context): Promise<void> {
    const param = this.voteValidator.vote(ctx.request.body);
    ctx.body = await this.voteService.createVote(param);
  }

  /**
   * 查看选举活动
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof VoteController
   */
  @get('/:voteId', { middleware: ['jwtAuth'] })
  async getVote(ctx: Context): Promise<void> {
    const param = this.voteValidator.voteId(ctx.params);
    ctx.body = await this.voteService.getVoteById(param.voteId);
  }

  /**
   * 查看候选人
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof VoteController
   */
  @get('/:voteId/candidates', { middleware: ['jwtAuth'] })
  async getVoteCandidates(ctx: Context): Promise<void> {
    const param = this.voteValidator.voteId(ctx.params);
    ctx.body = await this.candidateService.getCandidatesByVoteId(param.voteId);
  }

  /**
   * 新增候选人
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof VoteController
   */
  @post('/:voteId/candidates', { middleware: ['jwtAuth', 'admin'] })
  async addCandidates(ctx: Context): Promise<void> {
    const checkBodys: any[] = this.voteValidator.addCandidates(ctx.request.body);
    const param = this.voteValidator.voteId(ctx.params);

    const candidateList = checkBodys.map(body => ({
      name: body.name,
      voteId: param.voteId,
      votes: 0,
    }));

    ctx.status = 201;
    ctx.body = await this.candidateService.addCandidates(candidateList);
  }

  @del('/:voteId/candidates/:candidateId', { middleware: ['jwtAuth', 'admin'] })
  async delCandidates(ctx: Context): Promise<void> {
    const param = this.voteValidator.delCandidates(ctx.params);
    await this.candidateService.removeCandidate(param.candidateId);

    ctx.status = 204;
  }
}
