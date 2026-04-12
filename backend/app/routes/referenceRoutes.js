const express = require('express');
const referenceController = require('../controllers/referenceController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', referenceController.getAll);
router.get('/:id', referenceController.getById);
router.post('/', requireAuth, referenceController.create);
router.put('/:id', requireAuth, referenceController.update);
router.delete('/:id', requireAuth, referenceController.delete);

module.exports = router;
