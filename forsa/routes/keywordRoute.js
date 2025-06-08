var express = require('express');
const KeywordController = require('../controllers/keywordController');

var router = express.Router();

router.post('/keyword/createKeyword', KeywordController.createKeyword)
router.get('/keyword/findPopularKeywords', KeywordController.findPopularKeywords)

module.exports = router;
