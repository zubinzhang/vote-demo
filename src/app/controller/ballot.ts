import { Context, controller, inject, post, provide } from 'midway';

import { ICandidateService } from '../../service/interface';
import BallotValidator from '../validator/ballot';
import { IBallotService } from './../../service/interface.d';

@provide()
@controller('/v1/ballots')
export class BallotController {
  @inject('ballotService')
  ballotService: IBallotService;
  @inject('candidateService')
  candidateService: ICandidateService;

  @inject('ballotValidator')
  ballotValidator: BallotValidator;

  @post('/', { middleware: ['jwtAuth'] })
  async ballot(ctx: Context): Promise<void> {
    const param = this.ballotValidator.ballot(ctx.request.body);
    await this.ballotService.ballot({
      ballotTime: new Date(),
      userId: ctx.header.userId,
      voteId: param.voteId,
      candidateList: param.candidateList,
    });

    ctx.status = 204;
  }
}
