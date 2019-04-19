import { Logger } from 'egg-logger';
import { Redis } from 'ioredis';
import { logger, plugin, provide, WebMiddleware } from 'midway';
import assert = require('power-assert');

import MyError from '../../common/MyError';

// jwt auth
@provide('jwtAuth')
export class JwtAuth implements WebMiddleware {
  @plugin()
  jwt;

  @plugin()
  redis: Redis;

  @logger()
  logger: Logger;

  resolve() {
    return async (ctx, next) => {
      if (!ctx.header.authorization) {
        throw new MyError('Unauthorized', 401);
      }

      const token = ctx.header.authorization.split(' ')[1];

      try {
        // 解密，获取payload
        const payload = await this.jwt.verify(token, this.jwt.secret);

        // redisToken不存在表示token已过期
        const redisToken = await this.redis.get(`accessToken:${payload.userId}`);
        this.logger.info(payload, redisToken);

        // 验证是否为最新的token
        assert(token === redisToken, 'token已过期或者失效');

        ctx.header.userId = payload.userId;
      } catch (error) {
        this.logger.error('jwt验证失败：', error);
        throw new MyError('Unauthorized', 401);
      }

      await next();
    };
  }
}
