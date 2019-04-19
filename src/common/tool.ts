import { createHmac } from 'crypto';
import { Redis } from 'ioredis';
import { config, plugin, provide } from 'midway';

import { IUserResult } from '../service/interface';

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
   * @param {IUserResult} value
   * @returns {Promise<string>}
   * @memberof Tool
   */
  async sign(value: IUserResult): Promise<string> {
    const token: string = this.jwt.sign(value, this.jwt.secret, { expiresIn: '20min' });

    // redis保存accessToken,有效期20min
    await this.redis.set(`accessToken:${value.userId}`, token, 'EX', 60 * 20);

    return token;
  }
}
