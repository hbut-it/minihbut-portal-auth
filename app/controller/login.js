const { Controller } = require("egg");

const createRule = {
  username: "string",
  password: "string",
};

class LoginController extends Controller {
  /**
   * 入口函数
   */
  async index() {
    const { ctx } = this;

    // 验证请求参数
    ctx.validate(createRule, ctx.request.body);

    // 获取参数
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    // 获取 JSESSIONID, Execution, Salt
    const { session, execution, salt } = await this.getKeys(ctx);
    if (!session || !execution || !salt) {
      ctx.body = { code: 500, message: "Internal Server Error" };
      return;
    }

    // 获取验证码图片
    const captchaImage = this.getCaptchaImage(ctx, session);
    if (!captchaImage) {
      ctx.body = { code: 500, message: "Internal Server Error" };
      return;
    }

    // 获取验证码识别文本
    const captchaText = this.getCaptchaText(ctx, captchaImage);
    if (!captchaText) {
      ctx.body = { code: 500, message: "Internal Server Error" };
      return;
    }

    // 加密密码
    const encryptedPassword = ctx.service.encrypt.encryptPassword(
      password,
      salt
    );
    if (!encryptedPassword) {
      ctx.body = { code: 500, message: "Internal Server Error" };
      return;
    }
  }

  /**
   * 获取 JESSIONID, Execution, Salt
   * @param {Egg.Context<any>} ctx Context
   * @returns
   */
  async getKeys(ctx) {
    // 发起请求
    const res = await ctx.curl(
      `${ctx.app.config.auth.base}${ctx.app.config.auth.url.login}`
    );

    // 请求失败
    if (res.status !== 200) {
      return { session: null, execution: null, salt: null };
    }

    // 获取 JSESSIONID
    const session = res.headers["set-cookie"]
      .map((c) => c.split(";")[0])
      .find((c) => c.startsWith("JSESSIONID="))
      ?.split("=")[1];

    // 获取 execution
    const htmlBody = res.data.toString();
    const matchExecution = htmlBody.match(
      /<input[^>]*id="execution"[^>]*value="([^"]*)"/
    );
    const execution = matchExecution ? matchExecution[1] : null;

    // 获取 pwdEncryptSalt
    const matchSalt = htmlBody.match(
      /<input[^>]*id="pwdEncryptSalt"[^>]*value="([^"]*)"/
    );
    const salt = matchSalt ? matchSalt[1] : null;

    // 获取成功
    if (session && execution && salt) {
      return { session, execution, salt };
    }

    // 获取失败
    return { session: null, execution: null, salt: null };
  }

  /**
   * 获取验证码图片
   * @param {Egg.Context<any>} ctx Context
   * @param {string} session JSESSIONID
   * @returns {string} 验证码图片 Base64 编码
   */
  async getCaptchaImage(ctx, session) {
    // 发起请求
    const res = await ctx.curl(
      `${ctx.app.config.auth.base}${
        ctx.app.config.auth.url.getCaptcha
      }?${Math.floor(Date.now() / 1000)}`,
      {
        method: "GET",
        headers: {
          Cookie: "JSESSIONID=" + session,
        },
      }
    );

    // 请求失败
    if (res.status !== 200) {
      return null;
    }

    // 返回验证码图片 Base64 编码
    return res.data.toString("base64");
  }

  /**
   * 获取验证码文本
   * @param {Egg.Context<any>} ctx Context
   * @param {string} image 图片 Base64 编码
   * @returns {string} 验证码文本
   */
  async getCaptchaText(ctx, image) {
    // 发起请求
    const res = await ctx.curl(
      `${ctx.app.config.ocr.base}${ctx.app.config.ocr.url.ocr}`,
      {
        method: "POST",
        data: {
          image,
        },
        dataType: "json",
      }
    );

    // 请求失败
    if (res.status !== 200) {
      return null;
    }

    // 返回验证码文本
    return res.data.data;
  }
}

module.exports = LoginController;
