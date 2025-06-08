var express = require('express');
var authMiddleware = require('../helper/authMiddleware');
const notificationController = require('../controllers/notificationController');

var router = express.Router();

// router.get('/notification/fetchNotification', notificationController.fetchNotification);
router.post('/notification/createNotification', notificationController.createNotification);
router.get('/notification/fetchNotification', notificationController.fetchNotification);
router.post('/notification/notificationsStatus/:status', authMiddleware.authorize, notificationController.notificationStatus);
router.get('/notification/fetchNotificationforFeturedPosts', notificationController.fetchNotificationForFeaturedPosts);


module.exports = router;
