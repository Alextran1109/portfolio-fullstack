const express = require('express');
const serviceController = require('../controllers/serviceController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getById);
router.post('/', requireAuth, serviceController.create);
router.put('/:id', requireAuth, serviceController.update);
router.delete('/:id', requireAuth, serviceController.delete);

module.exports = router;
