const express = require('express');
const referenceController = require('../controllers/referenceController');

const router = express.Router();

router.get('/', referenceController.getAll);
router.get('/:id', referenceController.getById);
router.post('/', referenceController.create);
router.put('/:id', referenceController.update);
router.delete('/:id', referenceController.delete);

module.exports = router;
