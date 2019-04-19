import { app, assert } from 'midway-mock/bootstrap';
import * as moment from 'moment';

import { IVoteService } from '../../src/service/interface';

describe('/test/service/vote.test.ts', () => {
  let voteService: IVoteService;
  let id: number;

  before(async () => {
    voteService = await app.applicationContext.getAsync<IVoteService>('voteService');
  });

  // after(async () => {
  //   let voteModel: IVoteModel = await app.applicationContext.getAsync<IVoteModel>('voteModel');

  //   await voteModel.destroy({ where: { id } });
  // });

  it('#createVote', async () => {
    const result = await voteService.createVote({
      name: `vote:${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      startDate: new Date(),
      endDate: moment()
        .add(1, 'day')
        .toDate(),
    });

    assert(result !== null);
    assert(result.id > 0);

    id = result.id;
  });

  it('#updateVote', async () => {
    const result = await voteService.updateVote(
      {
        name: '选举活动',
        startDate: new Date(),
        endDate: moment()
          .add(1, 'day')
          .toDate(),
      },
      id
    );

    assert(result);
  });

  it('#isStart', async () => {
    const result = voteService.isStart(id);
    assert(result);
  });

  it('#getAllVotes', async () => {
    const result = await voteService.getAllVotes(10, 0);
    assert(result.count > 0);
    assert.ok(result.rows.length > 0);
  });

  it('#getVoteById', async () => {
    const result = await voteService.getVoteById(id);
    assert(result !== null);
  });
});
