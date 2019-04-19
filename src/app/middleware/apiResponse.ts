import { Context } from 'midway';

import MyError from '../../common/MyError';

export default function(options: any, app: any): any {
  return async (ctx: Context, next: any) => {
    try {
      await next();
    } catch (error) {
      ctx.logger.error(error);
      ctx.response.status = error instanceof MyError ? error.httpCode : 500;
      ctx.body = { error: error.message };
    }
  };
}
