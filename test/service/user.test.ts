import { app, assert } from 'midway-mock/bootstrap';

import { Tool } from '../../src/common/tool';
import { IUserModel } from '../../src/model/interface';
import { IUserService } from '../../src/service/interface';

describe('/test/service/user.test.ts', () => {
  let userService: IUserService;
  let tool: Tool;
  let userModel: IUserModel;

  let id: number;

  before(async () => {
    userService = await app.applicationContext.getAsync<IUserService>('userService');
    tool = await app.applicationContext.getAsync<Tool>('tools');

    userModel = await app.applicationContext.getAsync<IUserModel>('userModel');
  });

  after(async () => {
    await userModel.destroy({ where: { id } });
  });

  it('#createUser', async () => {
    const data = await userService.createUser({
      name: 'zubin',
      password: tool.hmac('123456'),
      email: 'test@qq.com',
      status: 1,
    });
    assert(!Number.isNaN(data));
    assert(data > 0);

    id = data;
  });

  it('#getAllUser', async () => {
    const data = await userService.getAllUser();
    assert(data !== null);
    assert(data.length > 0);
  });

  it('#login', async () => {
    const data = await userService.login({
      password: tool.hmac('123456'),
      email: 'test@qq.com',
    });
    assert(!Number.isNaN(data));
    assert(data > 0);
  });

  it('#checkUserActive', async () => {
    await userService.checkUserActive(1);
  });

  it('#checkUserActive', async () => {
    const result = await userService.updateUser({ name: 'test' }, id);
    assert(result >= 0);
  });
});
