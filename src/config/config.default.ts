export = (appInfo: any) => {
  const config: any = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1555323504293_2044';

  // add your config here
  config.middleware = ['apiResponse'];

  config.security = {
    csrf: false,
  };

  config.hmac = {
    algorithm: 'md5',
    key: '2ze0qk421h84k72ii1sf1sgeyu',
  };
  config.jwt = {
    secret: '762mLfGllWrXwAo6fYyYaBWfCryW3VAn',
  };

  config.mailer = {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'zubin2019@126.com',
      pass: 'zxc2019',
    },
  };

  // 邮件激活地址
  config.activeConfig = {
    url: 'http://127.0.0.1:7001',
  };

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'zxc#2019',
    database: 'db_vote',
    timezone: '+08:00',
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'localhost',
      password: '',
      db: 1,
    },
  };

  return config;
};
