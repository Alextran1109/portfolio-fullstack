const express = require('express');
const projectController = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', requireAuth, projectController.create);
router.put('/:id', requireAuth, projectController.update);
router.delete('/:id', requireAuth, projectController.delete);

module.exports = router;
