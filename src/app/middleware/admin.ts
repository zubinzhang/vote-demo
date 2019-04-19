import assert = require('assert');
import { provide, WebMiddleware } from 'midway';

import MyError from '../../common/MyError';

// jwt auth
@provide('admin')
export class Admin implements WebMiddleware {
  resolve() {
    return async (ctx, next) => {
      assert.equal(ctx.header.role, 1, new MyError('無權執行此操作', 401));

      await next();
    };
  }
}
