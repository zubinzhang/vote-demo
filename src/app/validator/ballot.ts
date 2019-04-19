import * as Joi from 'joi';
import { provide } from 'midway';

import MyError from '../../common/MyError';

@provide('ballotValidator')
export default class BallotValidator {
  private validate(rule, schema: Joi.SchemaLike) {
    const { error, value } = Joi.validate(rule, schema);
    if (error) {
      throw new MyError(error.message, 400);
    }
    return value;
  }

  ballot(value: any) {
    return this.validate(value, {
      voteId: Joi.number().required(),
      candidateList: Joi.array()
        .required()
        .min(2)
        .max(5)
        .items(Joi.number().required()),
    });
  }
}
