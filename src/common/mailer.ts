import { Logger } from 'egg-logger';
import { config, logger, provide } from 'midway';
import * as nodemailer from 'nodemailer';

@provide('mailer')
export default class Mailer {
  @config('mailer')
  mailerConfig;

  @logger()
  logger: Logger;

  /**
   * 验证用户邮箱
   *
   * @returns {Promise<any>}
   * @memberof IHelper
   */
  async sendMail({ email, userId }): Promise<any> {
    const transporter = nodemailer.createTransport(this.mailerConfig);

    return new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: this.mailerConfig.auth.user,
          subject: 'Confirm',
          to: email,
          html: `<p>Thanks for signing up! </p>
                <p>You must follow this link to activate your account: <a href="http://127.0.0.1:7001/user/activity?userId=${userId}">http://127.0.0.1:7001/user/activity</a></p>`,
        },
        (err, _info) => {
          if (err) {
            this.logger.info(`激活邮件发送失败！email:${email}，error:${err.message}`);
            return reject(err);
          }
          this.logger.info(`激活邮件发送成功！email:${email}`);
          resolve(true);
        }
      );
    });
  }
}
