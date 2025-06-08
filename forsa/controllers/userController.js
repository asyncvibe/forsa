"use strict";
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require("bcrypt-nodejs");
var FCM = require("fcm-node");
var serverKey = process.env.SERVERKEY; //put your server key here
var fcm = new FCM(serverKey);
const jwt = require("jsonwebtoken");
const joi = require("joi");
const _ = require("lodash");
const helper = require("../helper/commonHelper");
const Notification = require("../models/notifications");
const User = require("../models/user");
const Property = require("../models/property");
var rn = require("random-number");
var gen = rn.generator({
  min: -1000,
  max: 1000,
  integer: true
});

module.exports = {
  createAccount: async (req, res) => {
    try {
      let { name, email, password, mobile, role } = req.body;
      const schema = {
        name: joi
          .string()
          .min(3)
          .max(30)
          .required(),
        email: joi.string().email({ minDomainAtoms: 2 }),
        password: joi.string().required(),
        mobile: joi.string().required(),
        role: joi.string(),
        image: joi.string(),
        address: joi.string(),
        description: joi.string()
      };

      const result = joi.validate(req.body, schema);
      if (result.error == null) {
        let findUser = await User.findOne({ email: email.toLowerCase() });
        if (findUser) {
          return res.json({
            isSuccess: false,
            message: "Another user is registered with this email"
          });
        } else {
          // console.log('encrption',await helper.bcryptPassword(password))
          let createUser = await User.create({
            email: req.body.email.toLowerCase(),
            password: await helper.bcryptPassword(password),
            image: req.image,
            mobile: mobile,
            name: name,
            role: role,
            verify: true,
            imageCompany: req.imageCompany,
            address: req.body.address,
            description: req.body.description
          });

          if (createUser) {
            // let createNotification = await Notification.create({
            //     title: 'New User Joined',
            //     message: 'Please accept or reject this User',
            //     userId: createUser._id,
            //     userName: createUser.name,

            // })

            // let mailData = {
            //     to: process.env.MAILER,
            //     from: createUser.email,
            //     subject: 'Account Status',
            //     html: 'Please Approve this account',
            // }

            // let emailResult = await helper.sendMail(mailData);
            // if (emailResult) {
            return res.status(200).json({
              isSuccess: true,
              message: "User has been created successfully."
            });
            // }
          }
        }
      } else {
        return res.status(401).json({
          isSuccess: false,
          message: "All Fields are required",
          hint: result.error.details[0].message
        });
      }
    } catch (error) {
      res.json({
        message: "somthing went wrong",
        error: error.message
      });
    }
  },
  registerUser: async (req, res) => {
    try {
      let {
        name,
        email,
        password,
        mobile,
        role,
        deviceTokenId,
        description
      } = req.body;

      const schema = {
        name: joi
          .string()
          .min(3)
          .max(30)
          .required(),
        email: joi
          .string()
          .email({ minDomainAtoms: 2 })
          .required(),
        password: joi.string().required(),
        mobile: joi.string().required(),
        role: joi.string().required(),
        deviceTokenId: joi.required(),
        description: joi.required()
      };
      const result = joi.validate(req.body, schema);
      if (result.error == null) {
        // if (
        //   name &&
        //   email &&
        //   password &&
        //   req.imageUser &&
        //   req.imageCompany &&
        //   mobile &&
        //   role &&
        //   description &&
        //   deviceTokenId
        // ) {
        let findUser = await User.findOne({ email: email.toLowerCase() });
        if (findUser) {
          return res.json({
            isSuccess: false,
            message: "The email address is already in use by another account."
          });
        } else {
          //    let password = await helper.bcryptPassword(password)
          let createUser = await User.create({
            email: req.body.email.toLowerCase(),
            image: req.imageUser,
            imageCompany: req.imageCompany,
            ...req.body,
            password: await helper.bcryptPassword(password)
          });
          return res.status(200).json({
            isSuccess: true,
            message:
              "Account has been created successfully, you will be able to login when account is approved",
            createUser
          });
        }
      } else {
        return res.status(401).json({
          isSuccess: false,
          message: "All Fields are required",
          hint: result.error.details[0].message
        });
      }
    } catch (error) {
      res.json({
        message: "somthing went wrong",
        error: error.message
      });
    }
  },
  login: async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      if (email && password) {
        let findUser = await User.findOne({ email: email });

        if (!findUser) {
          return res.status(404).json({
            isSuccess: false,
            message: "email or password is invalid"
          });
        } else {
          bcrypt.compare(password, findUser.password, (err, isMatched) => {
            if (!isMatched) {
              return res
                .status(401)
                .json({ isSuccess: false, message: "password is invalid" });
            }
            if (findUser.verify == false) {
              return res.status(401).json({
                isSuccess: false,
                message: "Your account is not verified yet, please try later"
              });
            }
            const payload = {
              id: findUser.id,
              name: findUser.name,
              email: findUser.email,
              mobile: findUser.mobile,
              image: findUser.image,
              role: findUser.role
            };
            var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
              expiresIn: "2d"
            });
            // return res.header('x-auth-token', token).send(_.pick(findUser, ['_id', 'name', 'email', 'mobile']))
            return res.status(200).json({
              message: "This is the detail of the users",
              details: _.pick(findUser, [
                "_id",
                "name",
                "email",
                "role",
                "mobile",
                "image",
                "imageCompany",
                "deviceTokenId"
              ]),
              token: token
            });
          });
        }
      } else {
        return res.status(401).json({
          isSuccess: false,
          message: "email and password required."
        });
      }
    } catch (error) {
      console.log("catch", error);
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  findUserStats: async (req, res) => {
    try {
      let allUsers = await User.find({}).count();
      let verified = await User.find({ verify: true }).count();
      let unverified = await User.find({ verify: false }).count();
      let landlord = await User.find({ role: "Landlord" }).count();
      let broker = await User.find({ role: "Broker" }).count();
      let admin = await User.find({ role: "admin" }).count();
      let temp = [];
      temp.push(allUsers);
      temp.push(verified);
      temp.push(unverified),
        temp.push(landlord),
        temp.push(broker),
        temp.push(admin);
      res.status(200).json({
        isSuccess: true,
        all: allUsers,
        verified: verified,
        unverified: unverified,
        landlord: landlord,
        broker: broker,
        admin: admin,
        data: temp
      });
    } catch (error) {
      res.status(401).json({
        isSuccess: false,
        message: "something went wrong during process",
        error: error.message
      });
    }
  },

  editProfile: async (req, res) => {
    let id = req.params.id;
    let { name, email, mobile, role, description, address } = req.body;
    try {
      let profileEdit = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            email: email,
            mobile: mobile,
            role: role,
            image: req.image,
            description: description,
            address: address
            // password: await helper.bcryptPassword(password)
          }
        }
      );
      if (!profileEdit) {
        res.status(404).json({
          isSuccess: false,
          message: "You Entered the Invalid Information",
          error: "please enter valid credentials"
        });
      } else {
        let findUser = await User.findOne({ _id: id });

        res.status(200).json({
          isSuccess: true,
          message: "User Details",
          data: _.pick(findUser, [
            "role",
            "name",
            "email",
            "mobile",
            "_id",
            "address",
            "description"
          ])
        });
      }
    } catch (err) {
      res.status(401).json({
        isSuccess: false,
        message: "something went wrong during process",
        error: err.message
      });
    }
  },
  updateImage: async (req, res) => {
    try {
      console.log("myImage", req.image);
      let profileEdit = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            image: req.image
          }
        }
      );
      if(profileEdit){
        let findUser = await User.find({_id: req.params.id})
        return res.status(200).json({
          isSuccess: true,
          message: 'image is updated, successfully',
          image: findUser[0].image
        })
      }
    } catch (error) {
      res.status(401).json({
        isSuccess: false,
        message: "something went wrong during process",
        error: err.message
      });
    }
  },
  updateCompanyImage: async (req, res) => {
    try {
      let profileEdit = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            imageCompany: req.imageCompany
          }
        }
      );
      if(profileEdit){
        let findUser = await User.find({_id: req.params.id})
        return res.status(200).json({
          isSuccess: true,
          message: 'image is updated, successfully',
          image: findUser[0].imageCompany
        })
      }
    } catch (error) {
      res.status(401).json({
        isSuccess: false,
        message: "something went wrong during process",
        error: err.message
      });
    }
  },
  findOneUser: async (req, res) => {
    try {
      let id = req.params.id;
      let findUser = await User.findOne({ _id: id }).populate("assignedPosts");
      let temp = [];
      temp.push(findUser);
      if (findUser) {
        res.status(200).json({
          isSuccess: true,
          message: "These are the details of the user",
          // list:  _.pick(findUser, ['_id', 'name', 'email', 'mobile', 'role'])
          list: temp
        });
      } else {
        res.status(200).json({
          isSuccess: false,
          message: "No User Has Been Found",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "User against this id is not found.",
        error: error.message
      });
    }
  },

  sendMail: data => {
    const msg = {
      to: data.to,
      from: data.from,
      subject: data.subject,
      html: data.html
    };
    sgMail.send(msg, (err, result) => {
      if (err) {
        return false;
      }
      if (result) return true;
    });
  },

  sendEmailAlert: async (req, res) => {
    try {
      let mailData = {
        to: req.body.to,
        from: process.env.MAILER,
        subject: req.body.subject,
        html: req.body.html
      };
      // let emailResult = await helper.sendMail(mailData);
      sgMail.send(mailData, (error, result) => {
        if (error) {
          return res.status(401).json({
            isSuccess: false,
            message: "Eamil is not sent!",
            error
          });
        }
        if (result) {
          return res.status(200).json({
            isSuccess: true,
            message: "Eamil is sent!",
            result
          });
        }
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },

  findAllUsers: async (req, res) => {
    try {
      let findAllUsers = await User.find();
      if (findAllUsers.length > 0) {
        let newData = findAllUsers.filter(function(element) {
          return element.role !== "admin";
        });
        return res.status(200).json({
          isSuccess: true,
          message: "This is the list of available users",
          list: newData
        });
      } else {
        return res.status(200).json({
          isSuccess: true,
          message: "No user found.",
          findAllUsers
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },

  deleteOneUser: async (req, res) => {
    try {
      let id = req.params.id;

      let deleteUser = await User.deleteOne({ _id: id });
      if (deleteUser.deletedCount == 1) {
        res.status(200).json({
          isSuccess: true,
          message: "This is user has been deleted",
          deleteUser
        });
      } else {
        res.status(200).json({
          isSuccess: true,
          message: "This is user is not deleted",
          deleteUser
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },

  findUnverifiedUsers: async (req, res) => {
    try {
      let findUsers = await User.find({ verify: false });
      if (findUsers.length > 0) {
        res.status(200).json({
          isSuccess: true,
          message: "These are unverified Users",
          list: findUsers
        });
      } else {
        res.status(200).json({
          isSuccess: true,
          message: "No Unverified User Found",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  verifyUsers: async (req, res) => {
    try {
      let id = req.params.id;
      let undateUser = await User.findByIdAndUpdate(id, {
        $set: { verify: true }
      });
      console.log("server key:", serverKey);
      let findPerson = await User.find({ _id: id });
      let deviceToken = findPerson[0].deviceToken;
      var message = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: deviceToken,
        collapse_key: "green",

        notification: {
          title: "Account Verified",
          body: "Your account has been Verified, you can login now"
        }
      };

      fcm.send(message, function(err, response) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      let findUsers = await User.find({ verify: false });
      if (findUsers.length > 0) {
        res.status(200).json({
          isSuccess: true,
          message: "These are unverified Users",
          list: findUsers
        });
      } else {
        res.status(200).json({
          isSuccess: true,
          message: "No Unverified User Found",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  findBrokers: async (req, res) => {
    try {
      let name = "broker";
      let findBrokers = await User.find({
        role: new RegExp("^" + name + "$", "i")
      });
      if (findBrokers.length > 0) {
        let resultantArray = [];

        for (let i = 0; i < findBrokers.length; i++) {
          let temp = await _.pick(findBrokers[i], [
            "_id",
            "name",
            "email",
            "mobile",
            "role"
          ]);
          resultantArray.push(temp);
        }

        return res.status(200).json({
          isSuccess: true,
          message: "This is the list of brokers",
          list: resultantArray
        });
      } else {
        return res.status(200).json({
          isSuccess: false,
          message: "No Broker Found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  findCustomers: async (req, res) => {
    try {
      let name = "customer";
      let findBrokers = await User.find({
        role: new RegExp("^" + name + "$", "i")
      });
      if (findBrokers.length > 0) {
        let resultantArray = [];

        for (let i = 0; i < findBrokers.length; i++) {
          let temp = await _.pick(findBrokers[i], [
            "_id",
            "name",
            "email",
            "mobile",
            "role"
          ]);
          resultantArray.push(temp);
        }

        return res.status(200).json({
          isSuccess: true,
          message: "This is the list of brokers",
          list: resultantArray
        });
      } else {
        return res.status(200).json({
          isSuccess: false,
          message: "No Broker Found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  findLandlords: async (req, res) => {
    try {
      let name = "landlord";
      let findBrokers = await User.find({
        role: new RegExp("^" + name + "$", "i")
      });
      if (findBrokers.length > 0) {
        let resultantArray = [];

        for (let i = 0; i < findBrokers.length; i++) {
          let temp = await _.pick(findBrokers[i], [
            "_id",
            "name",
            "email",
            "mobile",
            "role"
          ]);
          resultantArray.push(temp);
        }

        return res.status(200).json({
          isSuccess: true,
          message: "This is the list of brokers",
          list: resultantArray
        });
      } else {
        return res.status(200).json({
          isSuccess: false,
          message: "No Broker Found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  findVerifiedUsers: async (req, res) => {
    try {
      let verifiedUsers = await User.find({ verify: true });
      if (verifiedUsers.length > 0) {
        let newData = verifiedUsers.filter(function(element) {
          return element.role !== "admin";
        });
        let resultantArray = [];

        for (let i = 0; i < newData.length; i++) {
          let temp = await _.pick(newData[i], [
            "_id",
            "name",
            "email",
            "mobile",
            "role"
          ]);
          resultantArray.push(temp);
        }

        return res.status(200).json({
          isSuccess: true,
          message: "This is the list of verified Users",
          list: resultantArray
        });
      } else {
        return res.status(200).json({
          isSuccess: false,
          message: "No Verified User Found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  // addPostsToList: async (req, res) => {
  //     try {
  //         let listId = req.params.id
  //         let incomingPosts = req.body
  //         // if (typeof req.body.incomingPosts == 'string')
  //         //     incomingPosts = req.body.incomingPosts.split(',');
  //         let findList = await List.find({ '_id': listId })
  //         let presentArray = findList[0].assignedPosts;
  //         let finalArray = []
  //         if (presentArray.length > 0) {

  //             for (let i = 0; i < incomingPosts.length; i++) {
  //                 let result = presentArray.indexOf(incomingPosts[i])
  //                 console.log('result:', result)
  //                 if (result == -1) {
  //                     console.log('in the negative',incomingPosts[i])
  //                     finalArray.push(incomingPosts[i])
  //                 }
  //             }

  //             let afterConcatination = presentArray.concat(finalArray)
  //             let updateArry = await List.findOneAndUpdate({ _id: listId }, { $set: { assignedPosts: afterConcatination } })
  //             console.log('updated array:', updateArry)
  //             let findUpdatedArray = await List.find({ _id: listId })
  //             if (updateArry) return res.status(200).json({
  //                 isSuccess: true,
  //                 message: 'Posts have been added to the list.',
  //                 list: findUpdatedArray
  //             })
  //         } else {
  //             let presentArray = incomingPosts
  //             console.log('in the else section:', presentArray)
  //             let updateArry = await List.findOneAndUpdate({ _id: listId }, { $set: { assignedPosts: presentArray } })
  //             let findUpdatedArray = await List.find({ _id: listId })
  //             if (updateArry) return res.status(200).json({
  //                 isSuccess: true,
  //                 message: 'Posts have been added to the list.',
  //                 list: findUpdatedArray
  //             })

  //         }

  //     } catch (error) {
  //         return res.status(401).json({
  //             isSuccess: false,
  //             message: 'something went wrong',
  //             error: error.message
  //         })
  //     }
  // }
  assignPostToUser: async (req, res) => {
    try {
      let userId = req.params.id;
      let incomingPosts = req.body;
      let findUser = await User.find({ _id: userId });
      let presentArray = findUser[0].assignedPosts;
      let deviceToken = findUser[0].deviceToken;
      let finalArray = [];
      if (presentArray.length > 0) {
        for (let i = 0; i < incomingPosts.length; i++) {
          let result = presentArray.indexOf(incomingPosts[i]);
          console.log("result:", result);
          if (result == -1) {
            console.log("in the negative", incomingPosts[i]);
            finalArray.push(incomingPosts[i]);
          }
        }

        let afterConcatination = presentArray.concat(finalArray);
        let updateArry = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { assignedPosts: afterConcatination } }
        );
        console.log("updated array:", updateArry);
        // assignedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: [] }]
        let findUpdatedArray = await User.find({ _id: userId });
        if (updateArry)
          var message = {
            to: deviceToken,
            collapse_key: "green",

            notification: {
              title: "Post Assign",
              body: "New Post has been assigned to you."
            }
          };

        fcm.send(message, function(err, response) {
          if (err) {
            console.log("Something has gone wrong!");
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
        return res.status(200).json({
          isSuccess: true,
          message: "Posts have been added to the User",
          list: findUpdatedArray
        });
      } else {
        let presentArray = incomingPosts;
        console.log("in the else section:", presentArray);
        let updateArry = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { assignedPosts: presentArray } }
        );
        let findUpdatedArray = await User.find({ _id: userId });
        if (updateArry)
          return res.status(200).json({
            isSuccess: true,
            message: "Posts have been added to the To User",
            list: findUpdatedArray
          });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  markAsFavorite: async (req, res) => {
    let language = "en";
    if (req.authData) {
      let findUser = await User.find({ _id: req.authData.id });
      language = findUser[0].language;
    } else {
      language = req.query.language;
    }

    if (req.params.action == 1) {
      let isUserExist = User.findOne({ email: req.authData.email });
      if (isUserExist) {
        let findFav = await User.find({ email: req.authData.email });
        let index = findFav[0].fav.indexOf(req.params.id);
        if (index == -1) {
          User.findOneAndUpdate(
            { email: req.authData.email },
            { $push: { fav: req.params.id } },

            function(error, success) {
              if (error) {
                res.status(404).json({
                  isSuccess: false,
                  message:
                    language == "en" ? "No Record found" : "لا يوجد سجلات",
                  error
                });
              } else {
                User.findById({ _id: req.authData.id }, function(err, data) {
                  if (err)
                    returnres.status(404).json({
                      isSuccess: false,
                      message:
                        language == "en" ? "No Record found" : "لا يوجد سجلات",
                      error
                    });
                  res.status(200).json({
                    isSuccess: true,
                    message:
                      language == "en"
                        ? "Added in fav list successfully"
                        : "أضيفت في قائمة الصوت العربي الحر بنجاح",
                    favoriteList: data.fav
                  });
                }).populate({
                  path: "fav",
                  populate: {
                    path: "sellerDetails"
                  }
                });
              }
            }
          );
        } else {
          res.status(200).json({
            isSuccess: false,
            message:
              language == "en"
                ? "This post Already exists in the favorites of this user."
                : "هذه المشاركة موجودة بالفعل في المفضلة لهذا المستخدم"
          });
        }
      } else {
        res.status(404).json({
          isSuccess: false,
          message: language == "en" ? "No Record found" : "لا يوجد سجلات"
        });
      }
    }
    if (req.params.action == 2) {
      User.update(
        { email: req.authData.email },
        { $pull: { fav: req.params.id } },
        { multi: true },
        function(err, resp) {
          if (err)
            res.status(404).json({
              isSuccess: false,
              message: language == "en" ? "No Record found" : "لا يوجد سجلات"
            });
          else
            User.findById({ _id: req.authData.id }, function(err, data) {
              if (err)
                returnres.status(404).json({
                  isSuccess: false,
                  message:
                    language == "en" ? "No Record found" : "لا يوجد سجلات",
                  error
                });
              res.status(200).json({
                isSuccess: true,
                message: "Removed Successfully",
                favoriteList: data.fav
              });
            }).populate({
              path: "fav",
              populate: {
                path: "sellerDetails"
              }
            });
        }
      );
    }
  },
  getAgentsList: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }
      let findBrokers = await User.find({
        role: new RegExp("^" + req.params.role + "$", "i"),
        verify: true
      });
      if (findBrokers.length > 0) {
        let resultantArray = [];

        for (let i = 0; i < findBrokers.length; i++) {
          let temp = await _.pick(findBrokers[i], [
            "_id",
            "name",
            "email",
            "mobile",
            "role",
            "image",
            "address",
            "imageCompany",
            "description",
            // "assignedPosts",
            "verify"
          ]);
          resultantArray.push(temp);
        }

        return res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? `This is the list of ${req.params.role}s`
              : `${req.params.role}هذه هي قائمة`,
          data: resultantArray
        });
      } else {
        return res.status(200).json({
          isSuccess: false,
          message:
            language == "en" ? "No Agent Found." : "لم يتم العثور على وسيط",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: language == "en" ? "something went wrong" : "هناك خطأ ما",
        error: error.message
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        let language = findUser[0].language;
      } else {
        let language = req.query.language;
      }
      let findUser = await User.findOne({ _id: req.authData.id }).populate({
        path: "fav",
        populate: {
          path: "sellerDetails"
        }
      });
      // .populate("assignedPosts")
      // .populate("fav");
      const payload = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        mobile: findUser.mobile,
        image: findUser.image,
        role: findUser.role
      };
      var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "2d"
      });

      let temp = [];
      temp.push(findUser);
      if (findUser) {
        res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "These are the details of the user"
              : "هذه هي تفاصيل المستخدم",
          data: findUser,
          token
        });
      } else {
        res.status(200).json({
          isSuccess: false,
          message:
            language == "en"
              ? "No User Has Been Found"
              : "لم يتم العثور على مستخدم",
          list: []
        });
      }
    } catch (error) {
      return res.status(200).json({
        isSuccess: false,
        message: "User against this id is not found.",
        error: error.message
      });
    }
  },

  // updateProfile: async (req, res) => {
  //   try {
  //     let { name, email, mobile, role } = req.body;
  //     const schema = {
  //       name: joi
  //         .string()
  //         .min(3)
  //         .max(30)
  //         .required(),
  //       email: joi
  //         .string()
  //         .email({ minDomainAtoms: 2 })
  //         .required(),
  //       mobile: joi.string().required(),
  //       role: joi.string().required()
  //     };
  //     const result = joi.validate(req.body, schema);
  //     if (result.error == null) {
  //       let profileEdit = await User.findByIdAndUpdate(
  //         { _id: req.authData.id },
  //         {
  //           $set: {
  //             name: name,
  //             email: email,
  //             mobile: mobile,
  //             role: role,
  //             image: req.imageUser,
  //             imageCompany: req.imageCompany
  //             // password: await helper.bcryptPassword(password)
  //           }
  //         }
  //       );
  //       if (!profileEdit) {
  //         res.status(404).json({
  //           isSuccess: false,
  //           message: "You Entered the Invalid Information",
  //           error: "please enter valid credentials"
  //         });
  //       } else {
  //         let findUser = await User.findOne({ _id: req.authData.id });

  //         res.status(200).json({
  //           isSuccess: true,
  //           message: "User Details",
  //           data: _.pick(findUser, [
  //             "role",
  //             "name",
  //             "email",
  //             "mobile",
  //             "_id",
  //             "image",
  //             "imageCompany"
  //           ])
  //         });
  //       }
  //     } else {
  //       return res.status(401).json({
  //         isSuccess: false,
  //         message: `All fields are required.`,
  //         hint: result.error.details[0].message
  //       });
  //     }
  //   } catch (err) {
  //     res.status(401).json({
  //       isSuccess: false,
  //       message: "something went wrong during process",
  //       error: err.message
  //     });
  //   }
  // },
  updateProfile: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }
      let {
        name,
        email,
        mobile,
        role,
        oldPassword,
        newPassword,
        description,
        address
      } = req.body;
      if (req.imageUser) {
        let profileEdit = await User.findByIdAndUpdate(
          { _id: req.authData.id },
          {
            $set: {
              image: req.imageUser
            }
          }
        );
      }
      if (req.imageCompany) {
        let profileEdit = await User.findByIdAndUpdate(
          { _id: req.authData.id },
          {
            $set: {
              imageCompany: req.imageCompany
            }
          }
        );
      }
      if (oldPassword && newPassword) {
        let findUser = await User.find({ _id: req.authData.id });
        let oldHash = findUser[0].password;
        bcrypt.compare(oldPassword, oldHash, async (err, isMatched) => {
          if (!isMatched) {
            res.status(200).json({
              isSuccess: false,
              message:
                language == "en"
                  ? "Please enter the correct old password to set new password."
                  : "الرجاء إدخال كلمة المرور القديمة الصحيحة لتعيين كلمة مرور جديدة"
            });
          } else {
            let profileEdit = await User.findByIdAndUpdate(
              { _id: req.authData.id },
              {
                $set: {
                  name: name,
                  email: email,
                  mobile: mobile,
                  password: await helper.bcryptPassword(newPassword),
                  role: role,
                  address: address,
                  description: description
                }
              }
            );
            if (profileEdit) {
              let findUser = await User.find({ _id: req.authData.id }).populate(
                "fav"
              );
              res.status(200).json({
                isSuccess: true,
                message:
                  language == "en"
                    ? "profile is updated."
                    : "يتم تحديث الملف الشخصي",
                data: findUser[0]
              });
            }
          }
        });
      } else {
        let profileEdit = await User.findByIdAndUpdate(
          { _id: req.authData.id },
          {
            $set: {
              name: name,
              email: email,
              mobile: mobile,
              role: role,
              address: address,
              description: description
            }
          }
        );
        if (profileEdit) {
          let findUser = await User.find({ _id: req.authData.id }).populate(
            "fav"
          );
          res.status(200).json({
            isSuccess: true,
            message:
              language == "en"
                ? "profile is updated."
                : "يتم تحديث الملف الشخصي",
            data: findUser[0]
          });
        }
      }
    } catch (error) {
      return res.status(403).json({
        isSuccess: false,
        message: "Something went wrong during the process.",
        error: error.message
      });
    }
  },
  changePassword: async (req, res) => {
    let language = "en";
    if (req.authData) {
      let findUser = await User.find({ _id: req.authData.id });
      language = findUser[0].language;
    } else {
      language = req.query.language;
    }

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if (oldPassword && newPassword) {
      let findUser = await User.find({ _id: req.authData.id });
      let oldHash = findUser[0].password;
      bcrypt.compare(oldPassword, oldHash, async (err, isMatched) => {
        if (!isMatched) {
          res.status(200).json({
            isSuccess: false,
            message:
              language == "en"
                ? "Please enter the correct old password to set new password."
                : "الرجاء إدخال كلمة المرور القديمة الصحيحة لتعيين كلمة مرور جديدة"
          });
        } else {
          let profileEdit = await User.findByIdAndUpdate(
            { _id: req.authData.id },
            {
              $set: {
                password: await helper.bcryptPassword(newPassword)
              }
            }
          );
          if (profileEdit) {
            let findUser = await User.find({ _id: req.authData.id });
            res.status(200).json({
              isSuccess: true,
              message:
                language == "en"
                  ? "password is updated."
                  : "يتم تحديث الملف الشخصي"
            });
          }
        }
      });
    }
    // let hash = await helper.bcryptPassword(req.body.password);
    // let email = req.body.email.toLowerCase();
    // User.findOneAndUpdate(
    //   { email: email },
    //   { $set: { password: hash } },
    //   { new: true },
    //   function(err, doc) {
    //     if (err) {
    //       res.status(200).json({
    //         isSuccess: false,
    //         message: language == "en" ? "No Record found" : "لا يوجد سجلات",
    //         err
    //       });
    //     } else {
    //       if (!doc) {
    //         res.status(200).json({
    //           isSuccess: false,
    //           message: language == "en" ? "No Record found" : "لا يوجد سجلات",
    //           err
    //         });
    //       } else {
    //         res.status(200).json({
    //           isSuccess: true,
    //           message:
    //             language == "en"
    //               ? "Password Updated Successfully"
    //               : "تم تحديث كلمة السر بنجاح"
    //         });
    //       }
    //     }
    //   }
    // );
    else {
      res.status(403).json({
        isSuccess: false,
        message:
          language == "en"
            ? "email and password both are requred."
            : "البريد الإلكتروني وكلمة المرور كلاهما مطلوب"
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }

      if (req.body.email) {
        let code = gen(900);
        let userFound = await User.findOne({ email: req.body.email });
        let updateCode = await User.updateOne(
          { email: req.body.email },
          { authToken: code }
        );
        if (userFound) {
          let isEmailSent = await helper.forgetPassword(
            req.body.email,
            code,
            userFound._id
          );

          res.status(200).json({
            isSuccess: true,
            message:
              language == "en"
                ? "We have Sent you a Mail.Please check your email"
                : "لقد أرسلنا لك رسالة بريد إلكتروني. يرجى التحقق من بريدك الإلكتروني"
            // code
          });
        } else {
          return res.status(200).json({
            isSuccess: false,
            message: language == "en" ? "No Record found" : "لا يوجد سجلات"
          });
        }
      } else {
        return res.status(403).json({
          isSuccess: false,
          message:
            language == "en"
              ? "Please enter the email."
              : "يرجى إدخال البريد الإلكتروني"
        });
      }
    } catch (error) {
      return res.status(403).json({
        isSuccess: false,
        message: "Something went wrong during the process.",
        error: error.message
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      let code = req.params.code;
      let newPassword = req.body.password;
      let id = req.params.id;
      let findUser = await User.findOne({ _id: id });
      if (findUser.authToken == code) {
        let updateCode = await User.findByIdAndUpdate(id, {
          $set: {
            authToken: ""
          }
        });
        let changePassword = await User.findByIdAndUpdate(id, {
          $set: {
            password: await helper.bcryptPassword(newPassword)
          }
        });
        if (changePassword) {
          res.status(200).json({
            isSuccess: true,
            message: "your password has been updated, successfully"
          });
        }
      } else {
        return res.status(403).json({
          isSuccess: false,
          message: "Your password change Request cannot be completed.",
          error: error.message
        });
      }
    } catch (error) {
      return res.status(403).json({
        isSuccess: false,
        message: "Something went wrong during the process.",
        error: error.message
      });
    }
  },
  register: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }

      let {
        name,
        email,
        password,
        mobile,
        address,
        role,
        deviceTokenId,
        description
      } = req.body;

      const schema = {
        name: joi
          .string()
          .min(3)
          .max(30)
          .required(),
        email: joi
          .string()
          .email({ minDomainAtoms: 2 })
          .required(),
        password: joi.string().required(),
        mobile: joi.string().required(),
        role: joi.string().required(),
        address: joi.string().required(),
        deviceToken: joi.required(),
        description: joi.required()
      };
      const result = joi.validate(req.body, schema);
      if (result.error == null) {
        let findUser = await User.findOne({ email: email.toLowerCase() });
        if (findUser) {
          return res.json({
            isSuccess: false,
            message:
              language == "en"
                ? "The email address is already in use by another account."
                : "عنوان البريد الإلكتروني قيد الاستخدام بالفعل من قبل حساب آخر"
          });
        } else {
          //    let password = await helper.bcryptPassword(password)
          let createUser = await User.create({
            email: req.body.email.toLowerCase(),
            image: req.imageUser,
            imageCompany: req.imageCompany,
            ...req.body,
            password: await helper.bcryptPassword(password)
          });

          const payload = {
            id: createUser._id,
            name: createUser.name,
            email: createUser.email,
            mobile: createUser.mobile,
            image: createUser.image,
            role: createUser.role,
            language: createUser.language
          };

          var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "2d"
          });

          return res.status(200).json({
            isSuccess: false,
            message:
              language == "en"
                ? "Account has been created successfully, you will be able to login when account is approved"
                : "تم إنشاء الحساب بنجاح ، ستتمكن من تسجيل الدخول عند الموافقة على الحساب",
            data: _.pick(createUser, [
              "_id",
              "name",
              "email",
              "role",
              "mobile",
              "image",
              "address",
              "imageCompany",
              "deviceTokenId"
            ]),
            token
          });
        }
      } else {
        return res.status(200).json({
          isSuccess: false,
          message:
            language == "en" ? "All Fields are required" : "جميع الحقول مطلوبة",
          hint: result.error.details[0].message
        });
      }
    } catch (error) {
      res.status(200).json({
        message: "somthing went wrong",
        error: error.message
      });
    }
  },
  signIn: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }

      let email = req.body.email;
      let password = req.body.password;
      if (email && password) {
        let findUser = await User.findOne({ email: email });
        if (req.body.deviceToken) {
          let updateCode = await User.updateOne(
            { email: req.body.email },
            { deviceToken: req.body.deviceToken }
          );
        }
        if (!findUser) {
          return res.status(200).json({
            isSuccess: false,
            message:
              language == "en"
                ? "email or password is invalid"
                : "البريد الإلكتروني أو كلمة المرور غير صالحة"
          });
        } else {
          bcrypt.compare(password, findUser.password, (err, isMatched) => {
            if (!isMatched) {
              return res.status(200).json({
                isSuccess: false,
                message:
                  language == "en"
                    ? "password is invalid"
                    : "كلمة المرور غير صالحة"
              });
            }
            if (findUser.verify == false) {
              return res.status(200).json({
                isSuccess: false,
                message:
                  language == "en"
                    ? "Your account is not verified yet, please try later"
                    : "لم يتم التحقق من حسابك بعد ، يرجى المحاولة لاحقًا"
              });
            }
            const payload = {
              id: findUser.id,
              name: findUser.name,
              email: findUser.email,
              mobile: findUser.mobile,
              image: findUser.image,
              role: findUser.role,
              language: findUser.language
            };
            var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
              expiresIn: "2d"
            });
            // return res.header('x-auth-token', token).send(_.pick(findUser, ['_id', 'name', 'email', 'mobile']))
            return res.status(200).json({
              isSuccess: true,
              message:
                language == "en"
                  ? "This is the detail of the users"
                  : "هذه هي تفاصيل المستخدمين",
              data: _.pick(findUser, [
                "_id",
                "name",
                "email",
                "role",
                "mobile",
                "image",
                "imageCompany",
                "deviceTokenId",
                "language"
              ]),
              token: token
            });
          });
        }
      } else {
        return res.status(200).json({
          isSuccess: false,
          message:
            language == "en"
              ? "email and password required."
              : "البريد الإلكتروني وكلمة المرور المطلوبة"
        });
      }
    } catch (error) {
      console.log("catch", error);
      return res.status(200).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  myAds: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }
      let findMyAds = await Property.find({ createdBy: req.authData.id })
        .populate("sellerDetails")
        .sort({ _id: -1 });
      if (findMyAds.length > 0) {
        res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "These are your created ads"
              : "هذه هي الإعلانات التي قمت بإنشائها",
          data: findMyAds
        });
      } else {
        res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "You have created no ad."
              : "لقد قمت بإنشاء أي إعلان",
          data: []
        });
      }
    } catch (error) {
      return res.status(200).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  getSellerInfo: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }
      let findUser = await User.find({ _id: req.params.id });
      res.status(200).json({
        isSuccess: true,
        message: language == "en" ? "Seller Details." : "تفاصيل البائع",
        data: findUser[0]
      });
    } catch (error) {
      return res.status(200).json({
        isSuccess: false,
        message: "something went wrong",
        error: error.message
      });
    }
  },
  changeLanguage: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }
      let myLanguage = req.body.language;
      let updateLanguage = await User.findByIdAndUpdate(req.authData.id, {
        language: myLanguage
      });
      res.status(200).json({
        isSuccess: true,
        message:
          language == "en"
            ? "your language has been updated, successfully."
            : "تم تحديث لغتك بنجاح"
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  }
};
