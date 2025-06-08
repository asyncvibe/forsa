var express = require('express');
const BugController = require('../controllers/bugController')
var router = express.Router();

router.post('/Bug/createBugReport', BugController.createBug);

module.exports = router;