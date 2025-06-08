var express = require('express');
const FAQController = require('../controllers/faqController')
var router = express.Router();

router.post('/FAQ/addQuestion', FAQController.addQuestion);
router.get('/FAQ/getFAQs', FAQController.getFAQs);
module.exports = router;
