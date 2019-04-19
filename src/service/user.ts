import assert = require('assert');
import { inject, provide } from 'midway';

import MyError from '../common/MyError';
import { IUserAttribute, IUserModel } from '../model/interface';
import { Tool } from './../common/tool';
import { ILoginParam, IUserService } from './interface';

@provide('userService')
export class UserService implements IUserService {
  @inject('userModel')
  userModel: IUserModel;

  @inject('tools')
  tools: Tool;

  async getAllUser(): Promise<any> {
    return this.userModel.findAll();
  }

  /**
   * 新增用户
   *
   * @param {IUserAttribute} user
   * @returns {Promise<IUserAttribute>}
   * @memberof UserService
   */
  async createUser(user: IUserAttribute): Promise<number> {
    const userInfo = await this.userModel.findOne({
      raw: true,
      where: { email: user.email },
    });

    assert(userInfo === null, new MyError('Email existed', 401));

    const result = await this.userModel.create(user, { raw: true });
    return result.id;
  }

  /**
   * 登录服务
   *
   * @param {string} email 邮箱
   * @param {string} password 密码
   * @returns {Promise<number>}
   * @memberof UserService
   */
  async login(value: ILoginParam): Promise<number> {
    const user = await this.userModel.findOne({
      raw: true,
      where: value,
    });
    assert(user !== null, new MyError('Incorrect email or password', 401));
    return user.id;
  }

  /**
   * 校验用户是否激活
   *
   * @param {number} userId 用户Id
   * @returns {Promise<void>}
   * @memberof UserService
   */
  async checkUserActive(userId: number): Promise<void> {
    const result = await this.userModel.count({ where: { id: userId, status: 2 } });

    assert(result === 1, '用户尚未激活');
  }

  /**
   * 更新用户信息
   *
   * @param {IUserAttribute} user 用户信息
   * @param {number} userId 用户Id
   * @returns {Promise<number>}
   * @memberof UserService
   */
  async updateUser(values: IUserAttribute, userId: number): Promise<number> {
    const result = await this.userModel.update(values, { where: { id: userId } });

    return result[0];
  }
}
