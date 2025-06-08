const Notification = require("../models/notifications");
const Property = require("../models/property");
const User = require("../models/user");
module.exports = {
  fetchNotification: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
         language = findUser[0].language;
      } else {
         language = req.query.language;
      }

      let notificationList = await Notification.find({});
      if (notificationList.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: language == 'en' ? "No notification found.":'لم يتم العثور على إشعار',
          list: notificationList
        });
      } else {
        return res.status(200).json({
          isSuccess: true,
          message:language == 'en'? "These are the notification":'هذه هي الإخطار',
          list: []
        });
      }
    } catch (error) {
      return res.status(404).json({
        isSuccess: false,
        message: language == 'en'?"Something went wrong during the process":'حدث خطأ ما أثناء العملية',
        error: error.message
      });
    }
  },
  createNotification: async (req, res) => {
    try {
      
      let createNotifications = await Notification.create({
        ...req.body
      });
      res.status(200).json({
        isSuccess: true,
        message: "Notification is created!",
        data: createNotifications
      });
    } catch (error) {
      return res.status(404).json({
        isSuccess: false,
        message: "Something went wrong during the process",
        error: error.message
      });
    }
  },
  fetchNotificationForFeaturedPosts: async (req, res) => {
    try {
      let pendingFeatured = await Property.find({ isFeatured: "pending" });

      return res.status(200).json({
        isSuccess: true,
        message: "New Request for the featured Post",
        list: pendingFeatured
      });
    } catch (error) {
      return res.status(404).json({
        isSuccess: false,
        message: "Something went wrong during the process",
        error: error.message
      });
    }
  },
  notificationStatus: async (req, res) => {
    try {
      let status = req.params.status;
      if (status == 1) {
        let notificationStatus = await User.findByIdAndUpdate(
          { _id: req.authData.id },
          {
            $set: {
              notifications: true
            }
          }
        );
        return res.status(200).json({
          isSuccess: true,
          message: "Notifications for this user has been enabled"
        });
      }
      if (status == 0) {
        let notificationStatus = await User.findByIdAndUpdate(
          { _id: req.authData.id },
          {
            $set: {
              notifications: false
            }
          }
        );
        return res.status(200).json({
          isSuccess: true,
          message: "Notifications for this user has been disabled"
        });
      }
    } catch (error) {
      return res.status(404).json({
        isSuccess: false,
        message: "Something went wrong during the process",
        error: error.message
      });
    }
  }
};
