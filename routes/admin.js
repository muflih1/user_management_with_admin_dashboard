const adminController = require('../controllers/adminController');
const { isLoggedOut, isAdmin, isAdminIsLoggedOut } = require('../middlewares/isAdmin');
const router = require('express').Router();

router.get('/login', isAdminIsLoggedOut, adminController.loginGet)
router.post('/login', isAdminIsLoggedOut, adminController.login)
router.get('/users', isAdmin, adminController.showUser);
router.get('/dashboard', isAdmin, adminController.dashboard)
router.get('/users/new', isAdmin, adminController.newUser);
router.post('/users', isAdmin, adminController.createUser)
router.get('/users/:id/edit', isAdmin, adminController.editUser);
router.put('/users/:id', isAdmin, adminController.updateUser);
router.delete('/users/:id/destroy', isAdmin, adminController.destroyUser);

module.exports = router;