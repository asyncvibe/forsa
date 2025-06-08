var express = require('express');
const multer = require('multer');
const categoryController = require('../controllers/categoryController')
var router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage })

router.post('/category/createCategory',  upload.single('image'), function (req, res, next) {
    if (req.file) {
        req.image = req.file.filename;
      } else {
        req.image = '';
      }
  next();
}, categoryController.createCategory);

router.get('/category/fetchAllCategories', categoryController.fetchAllCategories)
module.exports = router;
