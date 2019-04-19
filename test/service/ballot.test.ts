import assert = require('assert');
import { app } from 'midway-mock/bootstrap';
import moment = require('moment');

import { ICandidateModel } from '../../src/model/interface';
import { IBallotService, IVoteService } from '../../src/service/interface';

describe('/test/service/ballot.test.ts', () => {
  let ballotService: IBallotService;
  let candidateModel: ICandidateModel;

  let voteId: number;
  let candidates: number[];

  before(async () => {
    ballotService = await app.applicationContext.getAsync<IBallotService>('ballotService');
    const voteService: IVoteService = await app.applicationContext.getAsync<IVoteService>(
      'voteService'
    );
    candidateModel = await app.applicationContext.getAsync<ICandidateModel>('candidateModel');

    // 创建一个选举活动
    const voteInfo = await voteService.createVote({
      name: `选举活动${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      startDate: moment()
        .subtract(1, 'day')
        .toDate(),
      endDate: moment()
        .add(1, 'day')
        .toDate(),
    });
    voteId = voteInfo.id;

    // 新增候选人
    candidates = await Promise.all(
      [
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
      ].map(item => candidateModel.create(item).then(data => data.id))
    );
  });

  it('#ballot:用户尚未激活', async () => {
    await assert.rejects(
      () =>
        ballotService.ballot({
          ballotTime: new Date(),
          userId: 2,
          voteId,
          candidateList: candidates,
        }),
      /用户尚未激活/
    );
  });

  it('#ballot:可投票数少于2人', async () => {
    await assert.rejects(
      () =>
        ballotService.ballot({
          ballotTime: new Date(),
          userId: 1,
          voteId,
          candidateList: candidates.slice(0, 1),
        }),
      /可投票数少于2人/
    );
  });

  it('#ballot:可投票数为候选人的一半，不少于2人', async () => {
    // 新增候选人
    let tmpCandidates = await Promise.all(
      [
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
      ].map(item => candidateModel.create(item).then(data => data.id))
    );
    candidates = [...candidates, ...tmpCandidates];

    await assert.rejects(
      () =>
        ballotService.ballot({
          ballotTime: new Date(),
          userId: 1,
          voteId,
          candidateList: [1],
        }),
      /可投票数不少于/
    );
  });

  it('#ballot:可投票数为候选人的一半，不多于5人', async () => {
    await assert.rejects(
      async () =>
        ballotService.ballot({
          ballotTime: new Date(),
          userId: 1,
          voteId,
          candidateList: [1, 2, 3, 4, 5, 6],
        }),
      /可投票数不少于/
    );
  });

  it('#ballot', async () => {
    await ballotService.ballot({
      ballotTime: new Date(),
      userId: 1,
      voteId,
      candidateList: candidates.slice(0, 3),
    });
  });
});
