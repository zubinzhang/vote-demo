import { IApplicationContext, providerWrapper } from 'midway';
import { DATE, INTEGER, STRING } from 'sequelize';

import DB from './db';
import { ICandidateModel, IVoteAttribute, IVoteInstance } from './interface';

providerWrapper([
  {
    id: 'voteModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context: IApplicationContext) {
  const db: DB = await context.getAsync<DB>('voteDB');
  const candidateModel: ICandidateModel = await context.getAsync<ICandidateModel>('candidateModel');

  const voteModel = db.sequelize.define<IVoteInstance, IVoteAttribute>(
    'vote',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(128),
        allowNull: false,
      },
      startDate: {
        type: DATE,
        allowNull: false,
      },
      endDate: {
        type: DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'vote',
      timestamps: false,
    }
  );

  voteModel.hasMany(candidateModel, { foreignKey: 'voteId' });
  return voteModel;
}
