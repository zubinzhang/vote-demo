import assert = require('assert');
import { createHmac } from 'crypto';
import { Redis } from 'ioredis';
import { config, plugin, provide } from 'midway';

import MyError from './MyError';

@provide('tools')
export class Tool {
  @config('hmac')
  hmacConfig;

  @plugin()
  jwt;

  @plugin()
  redis: Redis;

  /**
   * Hmac加密
   *
   * @param {string} value 加密明文
   * @returns {string}
   * @memberof Tool
   */
  hmac(value: string): string {
    return createHmac(this.hmacConfig.algorithm, this.hmacConfig.key)
      .update(value)
      .digest('hex');
  }

  /**
   * jwt sign
   *
   * @param {number} userId
   * @returns {Promise<string>}
   * @memberof Tool
   */
  async sign(userId: number): Promise<string> {
    const token: string = this.jwt.sign({ userId }, this.jwt.secret, { expiresIn: '20min' });

    // redis保存accessToken,有效期20min
    const result = await this.redis.set(`accessToken:${userId}`, token, 'EX', 60 * 20, 'NX');
    assert(result === 'OK', new MyError('User is already login', 400));

    return token;
  }
}
