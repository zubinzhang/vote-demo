import { app, assert } from 'midway-mock/bootstrap';

/* tslint:enable */

describe('test/app/controller/user.test.ts', () => {
  it('should assert', async () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));
  });

  it('should GET /', () => {
    return app
      .httpRequest()
      .get('/v1/users')
      .expect(401);
  });
});
