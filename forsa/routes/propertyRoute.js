var express = require('express');
const multer = require('multer');
const propertyController = require('../controllers/propertyController')
var authMiddleware = require('../helper/authMiddleware');
var router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage })

router.post('/property/createProperty', upload.array('covers', 5), function (req, res, next) {
  if (req.files) {
    let tempArray = [];

    req.files.forEach(function (element) {
      tempArray.push(element.filename)
    })

    req.covers = tempArray
  } else {
    req.cover = "[]"; // filename: ''
  }
  next();
}, authMiddleware.authorize, propertyController.createProperty);
router.post('/property/createAdByLandlord', upload.array('covers', 5), function (req, res, next) {
  if (req.files) {
    let tempArray = [];

    req.files.forEach(function (element) {
      tempArray.push(element.filename)
    })

    req.covers = tempArray
  } else {
    req.cover = "[]"; // filename: ''
  }
  next();
}, authMiddleware.authorize, propertyController.createAdByLandlord);
router.delete('/property/deleteProperty/:id', propertyController.deleteProperty);
router.get('/property/fetchAllProperties', propertyController.fetchAllProperties);
router.get('/property/findPostsById/:id', propertyController.findPostsById);
router.post('/property/findAllPosts/:role?/:id?', propertyController.findAllPosts);
router.get('/property/fetchInactivePosts', propertyController.findInactivePosts);
router.get('/property/fetchactivePosts', propertyController.findActivePosts);
router.get('/property/findPropertyStates', propertyController.findPropertyStates);
router.get('/property/findPropertyStates', propertyController.findPropertyStates);
router.post('/property/makeFeaturedPost/:id', propertyController.makeFeaturedPost);
router.post('/property/makeUnfeaturedPost/:id', propertyController.makeUnfeaturedPost);
router.delete('/property/changePropertyStatus/:id', propertyController.changePropertyStatus);
// router.get('/property/crowJobApi', propertyController.cronJobApi);
router.post('/property/assignPropertyToBroker/:id', propertyController.assignPropertyToBrokers);
router.post('/property/changePostStatusToActive/:id', propertyController.makeAnActivePost);
router.post('/property/approveFeaturedPost/:id', authMiddleware.authorize, propertyController.approveFeaturedPost);
router.post('/property/searchApi/:id?', propertyController.searchApi);
router.get('/property/rangeFilterApi', propertyController.rangeFilterApi);
router.get('/property/furnishedProperty', propertyController.furnishedProperty);
router.get('/property/fetchfeaturedProperties', propertyController.featuredProperty);
router.get('/property/featuredrequested', propertyController.fetchFeaturedRequests);
router.get('/property/findPropertyByCategoryId/:id', propertyController.findPropertyByCategoryId);
router.get('/property/findPropertyByUserId/:id', propertyController.findPropertyByUserId);
router.post('/property/updateProperty/:id', authMiddleware.authorize, propertyController.updateProperty);
router.post('/property/updatePost/:id',upload.array('covers', 5), function (req, res, next) {
  if (req.files) {
    let tempArray = [];

    req.files.forEach(function (element) {
      tempArray.push(element.filename)
    })

    req.covers = tempArray
  } else {
    req.cover = "[]"; // filename: ''
  }
  next();
}, authMiddleware.authorize, propertyController.updatePost);
router.get('/property/findOneProperty/:id', propertyController.findOneProperty);
router.get('/property/getPostByPostId/:id/:userId?', propertyController.getPostByPostId);
router.post('/property/deletePost/:id', propertyController.deletePost);
router.post('/property/uploadImage/:id', upload.array('covers', 5), function (req, res, next) {
  if (req.files) {
    let tempArray = [];

    req.files.forEach(function (element) {
      tempArray.push(element.filename)
    })

    req.covers = tempArray
  } else {
    req.cover = "[]"; // filename: ''
  }
  next();
}, propertyController.uploadAnImage);
router.get('/property/deleteImageOfProperty/:id/:imageName', propertyController.deleteImageOfProperty);


module.exports = router;
