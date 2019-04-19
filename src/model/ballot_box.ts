import { IApplicationContext, providerWrapper } from 'midway';
import { INTEGER } from 'sequelize';

import DB from './db';
import { IBallotBoxAttribute, IBallotBoxInstance } from './interface';

providerWrapper([
  {
    id: 'ballotBoxModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context: IApplicationContext) {
  const db: DB = await context.getAsync('voteDB');

  return db.sequelize.define<IBallotBoxInstance, IBallotBoxAttribute>(
    'ballot_box',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ballotId: {
        type: INTEGER(11),
        allowNull: false,
      },
      candidateId: {
        type: INTEGER(11),
        allowNull: false,
      },
    },
    {
      tableName: 'ballot_box',
      timestamps: false,
    }
  );
}
