var express = require('express');
const adController = require('../controllers/adController')
var router = express.Router();

router.post('/Ad/createAd', adController.createAd);
router.get('/Ad/advrtListApi', adController.getAdvrtListApi);

module.exports = router;