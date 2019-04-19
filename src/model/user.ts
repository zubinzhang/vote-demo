import { IApplicationContext, providerWrapper } from 'midway';
import { INTEGER, STRING } from 'sequelize';

import DB from './db';
import { IUserAttribute, IUserInstance } from './interface';

providerWrapper([
  {
    id: 'userModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context: IApplicationContext) {
  const db: DB = await context.getAsync('voteDB');

  return db.sequelize.define<IUserInstance, IUserAttribute>(
    'user',
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
      password: {
        type: STRING(128),
        allowNull: false,
      },
      email: {
        type: INTEGER(128),
        allowNull: false,
      },
      role: {
        type: INTEGER(1),
        allowNull: false,
      },
      status: {
        type: INTEGER(1),
        allowNull: false,
      },
    },
    {
      tableName: 'user',
      timestamps: false,
    }
  );
}
