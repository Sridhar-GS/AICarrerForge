const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const evalController = require('../controllers/evalController');

router.post('/resume', upload.single('resume'), evalController.evaluateResume);
router.post('/github', evalController.evaluateGithub);
router.post('/communication', evalController.evaluateCommunication);
router.post('/finalize', evalController.finalizeEvaluation);

module.exports = router;