import * as Joi from 'joi';
import { provide } from 'midway';

import Validator from './validator';

@provide('ballotValidator')
export default class BallotValidator extends Validator {
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
