const { Controller } = require("egg");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = { code: 0, message: "OK" };
  }
}

module.exports = HomeController;
