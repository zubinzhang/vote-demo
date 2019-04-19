import { IApplicationContext, providerWrapper } from 'midway';
import { INTEGER, STRING } from 'sequelize';

import DB from './db';
import { ICandidateAttribute, ICandidateInstance } from './interface';

providerWrapper([
  {
    id: 'candidateModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context: IApplicationContext) {
  const db: DB = await context.getAsync('voteDB');
  // const voteModel: IVoteModel = await context.getAsync<IVoteModel>('voteModel');

  const candidateModel = db.sequelize.define<ICandidateInstance, ICandidateAttribute>(
    'candidate',
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
      votes: {
        type: INTEGER(11),
        allowNull: false,
      },
      voteId: {
        type: INTEGER(11),
        allowNull: false,
      },
    },
    {
      tableName: 'candidate',
      timestamps: false,
    }
  );

  // candidateModel.belongsTo(voteModel);

  return candidateModel;
}
