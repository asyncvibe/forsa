var express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
var router = express.Router();
var _ = require('lodash')
var authMiddleware = require("../helper/authMiddleware");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function(req, file, cb) {
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

router.post(
  "/user/createAccount",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imageCompany", maxCount: 1 }
  ]),
  function(req, res, next) {
    if (req.files["image"] && req.files["imageCompany"]) {
      if (req.files) {
        req.image = req.files["image"][0].filename;
        req.imageCompany = req.files["imageCompany"][0].filename;
    
      } else {
        req.image = "";
        req.imageCompany = "";
      }
      next();
    } else {
      return res.status(401).json({
        isSuccess: false,
        message: "User image and company image are required."
      });
    }
  },
  authMiddleware.authorize,
  userController.createAccount
);

router.post(
  "/user/registerUser",
  upload.fields([
    { name: "imageUser", maxCount: 1 },
    { name: "imageCompany", maxCount: 1 }
  ]),
  function(req, res, next) {
    if (req.files["imageUser"] && req.files["imageCompany"]) {
      if (req.files) {
        req.imageUser = req.files["imageUser"][0].filename;
        req.imageCompany = req.files["imageCompany"][0].filename;
    
      } else {
        req.imageUser = "";
        req.imageCompany = "";
      }
      next();
    } else {
      return res.status(401).json({
        isSuccess: false,
        message: "User image and company image are required."
      });
    }
  },
  userController.registerUser
);
router.post(
  "/user/register",
  upload.fields([
    { name: "imageUser", maxCount: 1 },
    { name: "imageCompany", maxCount: 1 }
  ]),
  function(req, res, next) {
    // if (req.files["imageUser"] && req.files["imageCompany"]) {
      if (!_.isEmpty(req.files)) {
        if(req.files['imageUser']){
          req.imageUser = req.files["imageUser"][0].filename;
        }
        if(req.files['imageCompany']){
          req.imageCompany = req.files["imageCompany"][0].filename;
        }
        
      } else {
        req.imageUser = "";
        req.imageCompany = "";
      }
  // upload.fields([
  //   { name: "imageUser", maxCount: 1 },
  //   { name: "imageCompany", maxCount: 1 }
  // ]),
  // function(req, res, next) {
  //   if (req.files["imageUser"] && req.files["imageCompany"]) {
  //     if (req.files) {
  //       req.imageUser = req.files["imageUser"][0].filename;
  //       req.imageCompany = req.files["imageCompany"][0].filename;
    
  //     } else {
  //       req.imageUser = "";
  //       req.imageCompany = "";
  //     }
      next();
    // } else {
    //   return res.status(200).json({
    //     isSuccess: false,
    //     message: "User image and company image are required."
    //   });
    // }
  },
  userController.register
);
router.post(
  "/user/updateProfile",
  upload.fields([
    { name: "imageUser", maxCount: 1 },
    { name: "imageCompany", maxCount: 1 }
  ]),
  function(req, res, next) {
    // if (req.files["imageUser"] && req.files["imageCompany"]) {
      if (!_.isEmpty(req.files)) {
        if(req.files['imageUser']){
          req.imageUser = req.files["imageUser"][0].filename;
        }
        if(req.files['imageCompany']){
          req.imageCompany = req.files["imageCompany"][0].filename;
        }
        
      } else {
        req.imageUser = "";
        req.imageCompany = "";
      }
      next();
    // } else {
    //   return res.status(401).json({
    //     isSuccess: false,
    //     message: "User image and company image are required."
    //   });
    // }
  },
  authMiddleware.authorize,
  userController.updateProfile
);

router.post("/user/login", userController.login);
router.post("/user/resetpassword/:code/:id", userController.resetPassword);
router.post("/user/changeLanguage",authMiddleware.authorize, userController.changeLanguage);
router.post("/user/signIn", userController.signIn);
router.post("/user/forgetPassword", userController.forgotPassword);
router.post("/user/changePassword",authMiddleware.authorize, userController.changePassword);
router.get("/user/findUserStats", userController.findUserStats);
router.get("/user/getSellerInfo/:id", userController.getSellerInfo);
router.post(
  "/user/markAsFavorite/:id/:action",
  authMiddleware.authorize,
  userController.markAsFavorite
);
router.get(
  "/user/myads",
  authMiddleware.authorize,
  userController.myAds
);
router.post(
  "/user/editProfile/:id",
  upload.single("image"),
  function(req, res, next) {
    if (req.file) {
      req.image = req.file.filename;
    } else {
      req.image = "";
    }
    next();
  },
  authMiddleware.authorize,
  userController.editProfile
);
router.post(
  "/user/updateImage/:id",
  upload.single("image"),
  function(req, res, next) {
    if (req.file) {
      req.image = req.file.filename;
    } else {
      req.image = "";
    }
    next();
  },
  authMiddleware.authorize,
  userController.updateImage
);
router.post(
  "/user/updateCompanyImage/:id",
  upload.single("imageCompany"),
  function(req, res, next) {
    if (req.file) {
      req.imageCompany = req.file.filename;
    } else {
      req.imageCompany = "";
    }
    next();
  },
  authMiddleware.authorize,
  userController.updateCompanyImage
);
router.post(
  "/user/sendEmailAlert",
  authMiddleware.authorize,
  userController.sendEmailAlert
);
router.get(
  "/user/findAllUsers",
  authMiddleware.authorize,
  userController.findAllUsers
);
router.get(
  "/user/findOneUser/:id",
  authMiddleware.authorize,
  userController.findOneUser
);
router.post(
  "/user/getProfile",
  authMiddleware.authorize,
  userController.getProfile
);
router.delete(
  "/user/deleteOneUser/:id",
  authMiddleware.authorize,
  userController.deleteOneUser
);
router.get(
  "/user/unVerifiedUsers",
  authMiddleware.authorize,
  userController.findUnverifiedUsers
);
router.get(
  "/user/verifyUser/:id",
  authMiddleware.authorize,
  userController.verifyUsers
);
router.get(
  "/user/findBrokers",
  authMiddleware.authorize,
  userController.findBrokers
);
router.get(
  "/user/findCustomers",
  authMiddleware.authorize,
  userController.findCustomers
);
router.get(
  "/user/findLandlords",
  authMiddleware.authorize,
  userController.findLandlords
);
router.post(
  "/user/getAgentsList/:role",
  userController.getAgentsList
);
router.get(
  "/user/findVerifiedUsers",
  authMiddleware.authorize,
  userController.findVerifiedUsers
);
router.post(
  "/user/assignPostsToUser/:id",
  authMiddleware.authorize,
  userController.assignPostToUser
);

module.exports = router;
