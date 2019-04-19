import { app, assert } from 'midway-mock/bootstrap';

import { Tool } from './../../src/common/tool';

describe('/test/common/tool.test.ts', () => {
  it('#hmac', async () => {
    const tool = await app.applicationContext.getAsync<Tool>('tools');
    const data = await tool.hmac('123456');
    assert(data === '5eeeb748d337e2ec5a33b8f5840e6c3c');
  });

  it('#sign', async () => {
    const tool = await app.applicationContext.getAsync<Tool>('tools');
    await tool.sign(1).catch(() => console.log);
  });
});
