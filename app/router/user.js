const { UserController } = require("../http/controllers/user.controller");
const { autoLogin } = require("../http/middlewares/checkLogin");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { imageValidator } = require("../http/validations/user");
const { upload_multer } = require("../modules/multer");

const router = require("express").Router();

router.get("/profile", autoLogin, UserController.getProfile);
router.post("/profile", autoLogin, UserController.editProfile);
router.post("/profile-image", autoLogin,
  upload_multer.single("image"), imageValidator(),
  expressValidatorMapper, UserController.uploadProfileImage
);
router.get("/inviteRequests", autoLogin, UserController.getAllInviteRequests);
router.get("/inviteRequests/:status", autoLogin, UserController.getRequestsByStatus);
router.get("/change-status-request/:id/:status", autoLogin, UserController.changeRequestStatus);

module.exports = {
  userRoutes: router,
};
