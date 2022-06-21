const router = require("express").Router();
const {autoLogin} = require("../http/middlewares/checkLogin")
const {ProjectController} =  require("../http/controllers/project.controller");
const { createProjectValidator } = require("../http/validations/project");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { uploadFile } = require("../modules/express-fileupload");
const fileupload = require("express-fileupload");
const { mongoIdValidator } = require("../http/validations/public");

router.post("/create", autoLogin,fileupload(), uploadFile, createProjectValidator(), expressValidatorMapper, ProjectController.createProject);
router.get("/list", autoLogin, ProjectController.getAllProjects);
router.get("/:id", autoLogin, mongoIdValidator(), expressValidatorMapper, ProjectController.getProjectById);
router.delete("/remove/:id", autoLogin, mongoIdValidator(), expressValidatorMapper, ProjectController.removeProject);

module.exports = {
  projectRoutes: router,
};
