import * as Joi from 'joi';

import MyError from '../../common/MyError';

export default class Validator {
  protected validate(rule, schema: Joi.SchemaLike) {
    const { error, value } = Joi.validate(rule, schema);
    if (error) {
      throw new MyError(error.message, 400);
    }
    return value;
  }
}
