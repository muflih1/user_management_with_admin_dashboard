const userController = require("../controllers/userController");
const {
  isLoggedOut,
  isVerified,
} = require("../middlewares/isAdmin");

const router = require("express").Router();

router.get("/users/register", isLoggedOut, userController.newController);
router.route("/users").post(isLoggedOut, userController.createController);
router.get("/users/login", isLoggedOut, userController.loginShowController);
router.post("/users/login", isLoggedOut, userController.loginController);
router.get("/", isVerified, userController.showUserPage);
router.post('/users/logout', isVerified, userController.logout);
router.get('/users/:id/edit', isVerified, userController.editController)

module.exports = router;
