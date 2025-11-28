const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUserRole,
} = require('../controllers/user.controller');

// all routes below are admin-only
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id/role', updateUserRole);

module.exports = router;
