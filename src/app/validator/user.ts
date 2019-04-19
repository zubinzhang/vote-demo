import * as Joi from 'joi';
import { provide } from 'midway';

import Validator from './validator';

@provide('userValidator')
export default class UserValidator extends Validator {
  /**
   * 新增用户
   *
   * @param {*} value
   * @memberof UserValidator
   */
  createUser(value: any) {
    return this.validate(value, {
      userName: Joi.string()
        .trim()
        .required(),
      password: Joi.string()
        .trim()
        .required(),
      email: Joi.string()
        .email()
        .required(),
    });
  }

  /**
   * 用户登录
   *
   * @param {*} value
   * @memberof UserValidator
   */
  login(value: any) {
    return this.validate(value, {
      email: Joi.string()
        .trim()
        .required(),
      password: Joi.string()
        .trim()
        .required(),
    });
  }

  /**
   * 用户登录
   *
   * @param {*} value
   * @memberof UserValidator
   */
  activity(value: any) {
    return this.validate(value, {
      userId: Joi.number().required(),
    });
  }
}
