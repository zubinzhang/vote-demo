import { app, assert } from 'midway-mock/bootstrap';
import moment = require('moment');

import { ICandidateService, IVoteService } from '../../src/service/interface';

describe('/test/service/candidate.test.ts', () => {
  let candidateService: ICandidateService;

  let ids: number[];
  let voteId: number;

  before(async () => {
    candidateService = await app.applicationContext.getAsync<ICandidateService>('candidateService');
    let voteService: IVoteService = await app.applicationContext.getAsync<IVoteService>(
      'voteService'
    );
    // 新增选举活动
    const voteInfo = await voteService.createVote({
      name: `选举活动${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      startDate: moment()
        .add(1, 'day')
        .toDate(),
      endDate: moment()
        .add(2, 'day')
        .toDate(),
    });
    voteId = voteInfo.id;
  });

  // after(async () => {
  //   await voteModel.destroy({ where: { id: voteId } });
  //   await candidateModel.destroy({ where: { voteId } });
  // });

  it('#addCandidates', async () => {
    const result = await candidateService.addCandidates([
      {
        name: '张三',
        votes: 0,
        voteId: voteId,
      },
      {
        name: '李四',
        votes: 0,
        voteId: voteId,
      },
      {
        name: '王五',
        votes: 0,
        voteId: voteId,
      },
    ]);

    assert(result !== null);
    assert(result.length > 0);

    ids = result.map(item => item.id);
  });

  it('#removeCandidate', async () => {
    const result = await candidateService.removeCandidate(ids[0]);

    assert(result);
  });

  it('#updateCandidate', async () => {
    const result = await candidateService.updateCandidate({ name: 'test' }, ids[1]);

    assert.equal(result, 1);
  });

  it('#updateCandidate', async () => {
    const result = await candidateService.getCandidateById(ids[1]);

    assert.ok(result !== null);
    assert.equal(result.id, ids[1]);
  });

  it('#getCandidatesByVoteId', async () => {
    const result = await candidateService.getCandidatesByVoteId(voteId);

    assert(result !== null);
    assert(result.length === 2);
  });

  it('#getCandidatesByVoteId', async () => {
    const result = await candidateService.getCandidateCountByVoteId(voteId);

    assert.equal(result, 2);
  });
});
