import { app, assert } from 'midway-mock/bootstrap';

import Mailer from '../../src/common/mailer';

describe('/test/common/mailer.test.ts', () => {
  it('#sendMail', async () => {
    const mailer = await app.applicationContext.getAsync<Mailer>('mailer');
    const data = await mailer.sendMail({ userId: 3, email: 'zubincheung@163.com' });
    assert(!!data);
  });
});
