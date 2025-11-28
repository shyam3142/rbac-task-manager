const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasksAdmin,
} = require('../controllers/task.controller');

router.use(protect);

router.get('/', getMyTasks);
router.post('/', createTask);

router.get('/all', authorize('admin'), getAllTasksAdmin); // admin-only

router
  .route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;
