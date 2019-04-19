'use strict';
import { async, config, init, provide, scope, ScopeEnum } from 'midway';
import { Sequelize } from 'sequelize';

@scope(ScopeEnum.Singleton)
@async()
@provide('voteDB')
export default class DB {
  sequelize: Sequelize;

  @config('sequelize')
  options;

  @init()
  connect() {
    this.sequelize = new Sequelize(
      this.options.database,
      this.options.username,
      this.options.password,
      {
        dialect: this.options.dialect,
        host: this.options.host,
        port: this.options.port,
        timezone: this.options.timezone,
        logging: true,
      }
    );
  }
}
