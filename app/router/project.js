const router = require("express").Router();
const {autoLogin} = require("../http/middlewares/checkLogin")
const {ProjectController} =  require("../http/controllers/project.controller");
const { createProjectValidator } = require("../http/validations/project");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { uploadFile } = require("../modules/express-fileupload");
const fileupload = require("express-fileupload");

router.post("/create", autoLogin,fileupload(), uploadFile, createProjectValidator(), expressValidatorMapper, ProjectController.createProject);

module.exports = {
  projectRoutes: router,
};
