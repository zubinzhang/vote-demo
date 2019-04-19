export = (appInfo: any) => {
  const config: any = (exports = {});

  config.sequelize = {
    dialect: 'mysql',
    host: 'vote-mysql',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'db_vote',
    timezone: '+08:00',
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'vote-redis',
      password: '',
      db: 1,
    },
  };

  return config;
};
