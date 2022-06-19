const { UserController } = require("../http/controllers/user.controller");
const { autoLogin } = require("../http/middlewares/checkLogin");

const router = require("express").Router();

router.get("/profile", autoLogin, UserController.getProfile);

module.exports = {
  userRoutes: router,
};
