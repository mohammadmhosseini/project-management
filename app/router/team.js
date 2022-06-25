const router = require("express").Router();
const { autoLogin } = require("../http/middlewares/checkLogin")
const { TeamController } = require("../http/controllers/team.controller");
const { createTeamValidator } = require("../http/validations/team");
const {expressValidatorMapper} = require("../http/middlewares/checkErrors");
const {mongoIdValidator} = require("../http/validations/public");

router.post("/create", autoLogin, createTeamValidator(), expressValidatorMapper, TeamController.createTeam);
router.get("/list", autoLogin, TeamController.getListOfTeams);
router.get("/me", autoLogin , TeamController.getMyTeams);
router.get("/invite/:teamId/:username", autoLogin, TeamController.inviteUserToTeam);
router.get("/:id", autoLogin, mongoIdValidator(), expressValidatorMapper, TeamController.getTeamById);
router.put("/edit/:teamId", autoLogin, TeamController.editTeam);
router.delete("/remove/:id", autoLogin, TeamController.removeTeamById);

module.exports = {
  teamRoutes: router,
};
