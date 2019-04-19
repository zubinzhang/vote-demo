import { IApplicationContext, providerWrapper } from 'midway';
import { DATE, INTEGER } from 'sequelize';

import DB from './db';
import { IBallotAttribute, IBallotInstance } from './interface';

providerWrapper([
  {
    id: 'ballotModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context: IApplicationContext) {
  const db: DB = await context.getAsync('voteDB');

  return db.sequelize.define<IBallotInstance, IBallotAttribute>(
    'ballot',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ballotTime: {
        type: DATE,
        allowNull: false,
      },
      userId: {
        type: INTEGER(11),
        allowNull: false,
      },
      voteId: {
        type: INTEGER(11),
        allowNull: false,
      },
    },
    {
      tableName: 'ballot',
      timestamps: false,
    }
  );
}
