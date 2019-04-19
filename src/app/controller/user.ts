import { Context } from 'egg';
import { config, controller, get, inject, plugin, post, provide } from 'midway';

import Mailer from '../../common/mailer';
import { IUserService } from '../../service/interface';
import UserValidator from '../validator/user';
import { Tool } from './../../common/tool';

@provide()
@controller('/v1/users')
export class UserController {
  @inject('userService')
  userService: IUserService;

  @inject('userValidator')
  userValidator: UserValidator;

  @inject('tools')
  tool: Tool;

  @inject('mailer')
  mailer: Mailer;

  @plugin()
  jwt;

  @config('jwt')
  jwtConfig;

  @get('/', { middleware: ['jwtAuth'] })
  async getAllUser(ctx: Context): Promise<void> {
    ctx.body = await this.userService.getAllUser();
  }

  /**
   * 用户登录
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof UserController
   */
  @post('/login')
  async login(ctx: Context): Promise<void> {
    // 参数校验
    ctx.body = this.userValidator.login(ctx.request.body);

    const userId = await this.userService.login({
      email: ctx.request.body.email,
      password: this.tool.hmac(ctx.request.body.password),
    });

    const token = await this.tool.sign(userId);
    ctx.body = { userId, accessToken: token };
  }

  /**
   * 用户注册
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof UserController
   */
  @post('/')
  async register(ctx: Context): Promise<void> {
    // 参数校验
    const param = this.userValidator.createUser(ctx.request.body);

    const userId = await this.userService.createUser({
      name: param.userName,
      password: this.tool.hmac(param.password),
      email: param.email,
      status: 1, // 待验证
    });

    // 发送验证链接
    await this.mailer.sendMail({ email: param.email, userId });

    const token = await this.tool.sign(userId);
    ctx.body = { userId, accessToken: token };
  }

  /**
   * 用户激活
   *
   * @param {Context} ctx
   * @returns {Promise<void>}
   * @memberof UserController
   */
  @get('/activity')
  async activity(ctx: Context): Promise<void> {
    // 参数校验
    const param = this.userValidator.activity(ctx.request.query);

    await this.userService.updateUser({ status: 2 }, param.userId);

    ctx.body = '帐号激活成功';
  }
}
