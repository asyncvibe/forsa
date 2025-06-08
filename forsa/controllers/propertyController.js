const joi = require("joi");
var Property = require("../models/property");
const User = require("../models/user");
var moment = require("moment");
const _ = require("lodash");
var FCM = require("fcm-node");
var serverKey = process.env.SERVERKEY; //put your server key here
var fcm = new FCM(serverKey);
module.exports = {
  createProperty: async (req, res) => {
    let isFeatured = req.body.isFeatured;
    if (req.body.isFeatured == "true" && req.authData.role !== "admin") {
      req.body.isFeatured = "pending";
    }
    if (req.body.isFeatured == "true" && req.authData.role === "admin") {
      req.body.isFeatured = true;
    }
    if (req.body.status == "true" && req.authData.role === "admin") {
      req.body.status = true;
    }
    if (req.body.status == "null" && req.authData.role === "admin") {
      req.body.status = false;
    }
    console.log("status of the post:", req.body.status);
    try {
      if ({ ...req.body }) {
      
          let createProperty = await Property.create({
            covers: req.covers,
            createdBy: req.authData.id,
            userId: req.authData.id,
            role: req.authData.role,
            // bedRooms: Number(req.body.bedRooms),
            // userId: req.authData._id
            ...req.body,
            summary: req.body.summary.toLowerCase()
            
          });

          return res.status(201).json({
            isSuccess: true,
            message: "New Property has been Created:",
            data: createProperty
          });
        
      } else {
        return res.status(401).json({
          isSuccess: false,
          message: "All Fields are required",
          hint: "empty Form is not Allowed"
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Property is not created",
        error: error.message
      });
    }
  },
  deleteProperty: async (req, res) => {
    try {
      let id = req.params.id;
      let deleteProperty = await Property.deleteOne({ _id: id });
      let findAllProperty = await Property.find({});
      if (deleteProperty.deletedCount == 1) {
        return res.status(200).json({
          isSuccess: true,
          message: "This Property Has Been Deleted",
          list: findAllProperty
        });
      } else {
        return res.status(401).json({
          isSuccess: false,
          message: "No Data is Deleted",
          status: deleteProperty
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "category is not created",
        error: error.message
      });
    }
  },
  fetchAllProperties: async (req, res) => {
    try {
      let allProperties = await Property.find({}).sort({_id: -1});
      if (allProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "It is the list of all Properties",
          list: allProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: "No Property Found",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  assignPropertyToBrokers: async (req, res) => {
    try {
      let data = req.body;
      let id = req.params.id;
      console.log(`data:${data} and id: ${id}`);

      let findProperty = await Property.find({ _id: id });
      if (findProperty[0].assignedTo.length == 0) {
        console.log("The data is:", data);
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },

  findPropertyStates: async (req, res) => {
    try {
      let props = [];
      let allPosts = await Property.find({}).count();
      props.push(allPosts);
      let active = await Property.find({ status: true }).count();
      props.push(active);
      let inactive = await Property.find({ status: false }).count();
      props.push(inactive);
      let isFeatured = await Property.find({ isFeatured: true }).count();
      props.push(isFeatured);
      // let unFeatured = await Property.find({$or:[{isFeatured:''},{isFeatured:'pending'}]}).count();
      // props.push(unFeatured);
      let pendingFeatured = await Property.find({
        isFeatured: "pending"
      }).count();
      props.push(pendingFeatured);

      res.status(200).json({
        isSuccess: true,
        message: "All states of property",
        allProps: allPosts,
        active: active,
        inactive: inactive,
        isFeatured: isFeatured,
        pendingFeatured: pendingFeatured,
        allStats: props
      });
    } catch (error) {
      return res.status(501).json({
        isSuccess: false,
        message: "something went wrong during the search api",
        error: error.message
      });
    }
  },

  furnishedProperty: async (req, res) => {
    try {
      let allProperties = await Property.find({ isFurnished: true });
      if (allProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "It is the list of all Properties",
          list: allProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: "No Property Found",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  featuredProperty: async (req, res) => {
    try {
      let allProperties = await Property.find({ isFeatured: true });
      if (allProperties.length > 0) {
        let featuredPosts = allProperties.filter(element => {
          var now = moment(new Date());
          let featuredDate = moment(element.featuredDate);
          var duration = moment.duration(now.diff(featuredDate));
          var diff = duration.asDays();
          console.log("difference of days:", diff);
          if (diff > 5) {
            Property.findByIdAndUpdate(element._id, {
              $set: { isFeatured: false }
            });
          }
          return diff <= 5;
        });

        return res.status(200).json({
          isSuccess: true,
          message: "It is the list of featured Properties",
          //   list: featuredPosts
          list: featuredPosts
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: "No Featured Property Found.",
          list: allProperties
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  findPropertyByCategoryId: async (req, res) => {
    try {
      let allProperties = await Property.find({ categoryId: req.params.id });
      if (allProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "It is the list of all Properties",
          list: allProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: "No Property Found",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  findPropertyByUserId: async (req, res) => {
    try {
      let allProperties = await Property.find({ userId: req.params.id });
      if (allProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "It is the list of properties created by this user.",
          list: allProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: "No Property Found against this user.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  updateProperty: async (req, res) => {
    try {
      let id = req.params.id;
      let data = req.body;

      if (req.body.status == "true" && req.authData.role === "admin") {
        req.body.status = true;
      }
      if (req.body.status == "null" && req.authData.role === "admin") {
        req.body.status = false;
      }
      console.log("status:", req.body.status);
      // Model.findByIdAndUpdate(id, { $set: { name: 'jason bourne' }}, options, callback)
      let updatePost = await Property.findByIdAndUpdate(id, {
        ...req.body,
        status: req.body.status
      });
      let findItem = await Property.find({ _id: id });
      res.status(200).json({
        isSuccess: true,
        message: "Post has been updated successfully.",
        data: findItem
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  findOneProperty: async (req, res) => {
    try {
      let id = req.params.id;
      let findProperty = await Property.findById(id);
      return res.status(200).json({
        isSuccess: true,
        message: "This is the required Property",
        list: findProperty
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  deleteImageOfProperty: async (req, res) => {
    try {
      let id = req.params.id;
      let image = req.params.imageName;

      let findPost = await Property.findOne({ _id: id });
      let initialArray = findPost.covers;
      let newArray = initialArray.filter(element => element !== image);
      let updatePost = await Property.findByIdAndUpdate(id, {
        $set: { covers: newArray }
      });
      let findUPdatedPost = await Property.findOne({ _id: id });
      return res.status(200).json({
        isSuccess: true,
        message: "image is deleted",
        findUPdatedPost
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  uploadAnImage: async (req, res) => {
    try {
      let id = req.params.id;
      let data = req.covers;
      let findPost = await Property.findOne({ _id: id });
      let initialArray = findPost.covers;
      for (let value of data) {
        initialArray.push(value);
      }
      let updatePost = await Property.findByIdAndUpdate(id, {
        $set: { covers: initialArray }
      });
      let findUPdatedPost = await Property.findOne({ _id: id });
      return res.status(200).json({
        isSuccess: true,
        message: "image is deleted",
        findUPdatedPost
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  fetchFeaturedRequests: async (req, res) => {
    try {
      let findFeaturedProperties = await Property.find({
        isFeatured: "pending"
      });
      if (findFeaturedProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "These are the featured requested properties",
          list: findFeaturedProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: true,
          message: "No featured request found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  approveFeaturedPost: async (req, res) => {
    try {
      let id = req.params.id;
      if (req.authData.role === "admin") {
        let updatePost = await Property.findByIdAndUpdate(id, {
          $set: { isFeatured: true, featuredDate: moment() }
        });
        let findPost = await Property.find({ _id: id });
        let createdBy = await findPost[0].createdBy;
        let findUser = await User.find({ _id: createdBy });
        let deviceToken = findUser[0].deviceToken;
        var message = {
          to: deviceToken,
          collapse_key: "green",

          notification: {
            title: "Feature Request",
            body: "Your post feature request is approved."
          }
        };

        fcm.send(message, function(err, response) {
          if (err) {
            console.log("Something has gone wrong!");
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
        let findFeaturedPosts = await Property.find({ isFeatured: "pending" });
        return res.status(200).json({
          isSuccess: true,
          message: "These are updated posts",
          list: findFeaturedPosts
        });
      } else {
        return res.status(403).json({
          isSuccess: true,
          message: "you are not an admin"
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  findInactivePosts: async (req, res) => {
    try {
      let findInactiveProperties = await Property.find({ status: false });
      if (findInactiveProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "These are the Pending properties",
          list: findInactiveProperties
        });
      } else {
        return res.status(400).json({
          isSuccess: true,
          message: "No pending post request found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  findActivePosts: async (req, res) => {
    try {
      let findInactiveProperties = await Property.find({ status: true });
      if (findInactiveProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "These are the active posts",
          list: findInactiveProperties
        });
      } else {
        return res.status(400).json({
          isSuccess: true,
          message: "No active post found.",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  makeAnActivePost: async (req, res) => {
    try {
      let id = req.params.id;
      let updatePost = await Property.findByIdAndUpdate(id, {
        $set: { status: true }
      });
      //fcm notifications
      let findPost = await Property.find({ _id: id });
      let createdBy = await findPost[0].createdBy;
      let findUser = await User.find({ _id: createdBy });
      let deviceToken = findUser[0].deviceToken;
      var message = {
        to: deviceToken,
        collapse_key: "green",

        notification: {
          title: "Activated Post",
          body: "Your post is approved and is active now."
        }
      };

      fcm.send(message, function(err, response) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      let findInactivePosts = await Property.find({ status: false });
      if (findInactivePosts.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: "These are remaining inactive posts",
          list: findInactivePosts
        });
      } else {
        return res.status(200).json({
          isSuccess: true,
          message: "These are remaining inactive posts",
          list: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },

  findAllPosts: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
         language = req.query.language;
      }

      if (req.params.id != undefined && req.params.role != undefined) {
        if (req.params.role == "broker") {
          let findUser = await User.find({ _id: req.params.id }).populate(
            "assignedPosts"
          );
          if (findUser.length > 0) {
            return res.status(200).json({
              isSuccess: true,
              message:
                language == "en"
                  ? "These are assigned Posts to the broker."
                  : "يتم تعيين هذه المشاركات للسمسار",
              data: _.pick(findUser[0], ["assignedPosts", "userId"])
            });
          } else {
            return res.status(404).json({
              isSuccess: true,
              message: "No data found.",
              data: findUser
            });
          }
        } else {
          let findProperties = await Property.find({
            createdBy: req.params.id
          });
          if (findProperties.length > 0) {
            return res.status(200).json({
              isSuccess: true,
              message:
                language == "en"
                  ? "These are the posts created by this user"
                  : "هذه هي المشاركات التي أنشأها هذا المستخدم",
              data: findProperties
            });
          } else {
            return res.status(404).json({
              isSuccess: true,
              message: language == "en" ? "No data found." : "لاتوجد بيانات",
              data: findProperties
            });
          }
        }
      }
      let id = req.body.id;
      if (id) {
        let findUser = await User.find({ _id: id });
        let favArray = findUser[0].fav;
        let findItems = await Property.find({ status: true })
          .sort({ _id: -1 })
          .populate("sellerDetails")
          .sort({ _id: -1 });
        let tempArray = [];
        for (let favItem of findItems) {
          let favExist = favArray.find(item => item._id.equals(favItem._id));
          let myObj = {
            isFav: favExist ? true : false,
            ...favItem._doc
          };
          tempArray.push(myObj);
        }
        return res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "It is the list of all Properties"
              : "إنها قائمة بجميع الخصائص",
          data: tempArray
        });
      }
      let allProperties = await Property.find({ status: true })
        .populate("sellerDetails")
        .sort({ _id: -1 });
      if (allProperties.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "It is the list of all Properties"
              : "إنها قائمة بجميع الخصائص",
          data: allProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message:
            language == "en" ? "No Property Found" : "لم يتم العثور على عقار",
          data: []
        });
      }
    } catch (error) {
      return res.status(200).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  createAdByLandlord: async (req, res) => {
    if (req.authData.role === "Landlord") {
      let isFeatured = req.body.isFeatured;
      if (req.body.isFeatured == "true" && req.authData.role !== "admin") {
        req.body.isFeatured = "pending";
      }

      try {
        let {
          propertyType,
          price,
          summary,
          title,
          area,
          purpose,
          address
        } = req.body;
        if (
          propertyType &&
          price &&
          summary &&
          area &&
          address &&
          purpose &&
          req.covers
        ) {
          let createProperty = await Property.create({
            covers: req.covers,
            createdBy: req.authData.id,
            userId: req.authData.id,
            sellerDetails: req.authData.id,
            role: req.authData.role,
            status: false,
            // bedRooms: Number(req.body.bedRooms),
            // userId: req.authData._id
            ...req.body
          });

         

          
            let language = "en";
            if (req.authData) {
              let findUser = await User.find({ _id: req.authData.id });
              language = findUser[0].language;
            } else {
               language = req.query.language;
            }

          return res.status(200).json({
            isSuccess: true,
            message:
              language == "en"
                ? `Advertisement Created Successfully, it will be visible after Admin approval.`
                : `تم إنشاء الإعلان بنجاح ، سيكون مرئيًا بعد موافقة المسؤول`,
            data: createProperty
          });
        } else {
          return res.status(200).json({
            isSuccess: false,
            message:
              language == "en"
                ? "All Fields are required"
                : "جميع الحقول مطلوبة"
          });
        }
      } catch (error) {
        return res.status(200).json({
          isSuccess: false,
          message:
            language == "en"
              ? "Property is not created"
              : "لم يتم إنشاء الملكية",
          error: error.message
        });
      }
    } else {
      return res.status(200).json({
        isSuccess: false,
        message:
          req.authData.language == "en"
            ? "Please login as a Landlord to create an Ad"
            : "يرجى تسجيل الدخول كمالك لإنشاء إعلان"
      });
    }
  },
  //filter api for max and min range on various properties
  rangeFilterApi: async (req, res) => {
    try {
      let max = parseInt(req.body.max);
      let min = parseInt(req.body.min);
      let prop = req.body.property;
      console.log("property:", prop);
      console.log("max", max);
      console.log("min", min);
      // console.log('coming data', req.body)
      let findAllProperties = await Property.find({});
      if (findAllProperties.length > 0) {
        const filteredProperties = findAllProperties.filter(
          element => element[prop] <= max && element[prop] >= min
        );
        return res.status(200).json({
          isSuccess: false,
          message: "These are filtered properties",
          list: filteredProperties
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: "No property found",
          list: []
        });
      }
    } catch (error) {
      return res.status(501).json({
        isSuccess: false,
        message: "something went wrong during the search api",
        error: error.message
      });
    }
  },
  searchApi: async (req, res) => {
    try {
      let searchKey = req.body;
      let propertyType = [];

      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
      language = req.query.language;
      }

      for (let key in searchKey) {
        
        if (key == "summary" && searchKey[key] != "") {
          propertyType = await Property.find({}).populate("sellerDetails");
          if (propertyType.length > 0) {
            let search = searchKey[key].toLowerCase();
            propertyType = propertyType.filter(element =>
              element.summary.includes(search)
            );
          }
        }
        if (key == "propertyType" && searchKey[key] != "") {
          propertyType = await Property.find({
            propertyType: searchKey[key]
          }).populate("sellerDetails");
        }
       
        if (key == "purpose" && searchKey[key] != "") {
          propertyType = propertyType.filter(
            element => element.purpose == searchKey[key]
          );
        }
        if (key == "price" && searchKey[key] != "") {
          
          propertyType = propertyType.filter(
            element => element.price <= searchKey[key]
          );
          console.log("property in price::", propertyType);
        }
        if (key == "bedRooms" && searchKey[key] != "") {
          propertyType = propertyType.filter(
            element => element.bedRooms <= searchKey[key]
          );
        }
        if (key == "bathRooms" && searchKey[key] != "") {
          propertyType = propertyType.filter(
            element => element.bathRooms <= searchKey[key]
          );
        }
        if (key == "address" && searchKey[key] != "") {
          propertyType = propertyType.filter(element =>
            element.address.includes(searchKey[key])
          );
        }
        if (key == "area" && searchKey[key] != "") {
          propertyType = propertyType.filter(
            element => element.area <= searchKey[key]
          );
        }
        if(key == "subCategoryType" && searchKey[key] != ""){
          propertyType = propertyType.filter(
            element => element.subCategoryType == searchKey[key]
          );
        }

      }
      if (propertyType.length > 0) {
        let id = req.params.id;
        if (id) {
          let findUser = await User.find({ _id: id });
          let favArray = findUser[0].fav;
          let tempArray = [];
          for (let favItem of propertyType) {
            let favExist = favArray.find(item => item._id.equals(favItem._id));
            let myObj = {
              isFav: favExist ? true : false,
              ...favItem._doc
            };
            tempArray.push(myObj);
          }
          res.status(200).json({
            isSuccess: true,
            message: language == "en" ? "search result is" : "نتيجة البحث هي",
            data: tempArray
          });
        }else{
          res.status(200).json({
            isSuccess: true,
            message: language == "en" ? "search result is" : "نتيجة البحث هي",
            data: propertyType
          });
        }
      } else {
        res.status(404).json({
          isSuccess: false,
          message: language == "en" ? "no record found" : "لا يوجد سجلات",
          data: []
        });
      }
    } catch (error) {
      res.status(501).json({
        isSuccess: false,
        message: "something went wrong during the search",
        error: error.message
      });
    }
  },
  findPostsById: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
         language = req.query.language;
      }

      let findPosts = await Property.find({
        createdBy: req.params.id
      }).populate("sellerDetails");
      if (findPosts.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "These are posts against this user."
              : "هذه منشورات ضد هذا المستخدم",
          data: findPosts
        });
      } else {
        return res.status(200).json({
          isSuccess: false,
          message:
            language == "en"
              ? "No post found against this user."
              : "لم يتم العثور على مشاركة ضد هذا المستخدم",
          data: []
        });
      }
    } catch (error) {
      res.status(501).json({
        isSuccess: false,
        message: "something went wrong during the process",
        error: error.message
      });
    }
  },
  getPostByPostId: async (req, res) => {
    try {
      let id = req.params.id;

      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
      language = req.query.language;
      }

      let findItem = await Property.findById(id).populate("sellerDetails");
      let userId = req.params.userId;
      if (userId) {
        let findUser = await User.find({ _id: userId });
        let favArray = findUser[0].fav;
        // let tempArray = [];

        let favExist = favArray.find(item => item._id.equals(findItem._id));
        let myObj = {
          isFav: favExist ? true : false,
          ...findItem._doc
        };
        // tempArray.push(myObj);
        return res.status(200).json({
          isSuccess: true,
          message: "This is the required Property",
          data: myObj
        });
      }

      return res.status(200).json({
        isSuccess: true,
        message: "This is the required Property",
        data: findItem
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
       language = findUser[0].language;
      } else {
       language = req.query.language;
      }

      let id = req.params.id;
      let deletePost = await Property.deleteOne({ _id: id });
      if (deletePost.deletedCount == 1) {
        return res.status(200).json({
          isSuccess: true,
          message: language == "en" ? "The post is deleted." : "تم حذف المنشور"
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message:
            language == "en"
              ? "Post against this id, doesnot exist"
              : "الرد على هذا المعرف ، غير موجود"
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },

  updatePost: async (req, res) => {
    try {
      let id = req.params.id;
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
       language = findUser[0].language;
      } else {
      language = req.query.language;
      }
      let {
        propertyType,
        address,
        subCategoryType,
        price,
        area,
        purpose,
        bedRooms,
        bathRooms,
        isFeatured,
        isFurnished,
        summary
      } = req.body;
      if (req.authData.role == "Landlord") {
        if (req.covers.length > 0) {
          let findProperty = await Property.find({ _id: id });
          let myCovers = findProperty[0].covers;
          for (let i = 0; i < req.covers.length; i++) {
            myCovers.pop();
          }
          for (let j = 0; j < req.covers.length; j++) {
            myCovers.push(req.covers[j]);
          }
          let updateCovers = await Property.findByIdAndUpdate(id, {
            covers: myCovers
          });
          if (isFeatured == "true") {
            req.body.isFeatured = "pending";
          }
          let updatePost = await Property.findByIdAndUpdate(id, {
            ...req.body
          });
          let findItem = await Property.find({ _id: id }).populate(
            "sellerDetails"
          );
          res.status(200).json({
            isSuccess: true,
            message:
              language == "en"
                ? "Post has been updated successfully."
                : "تم تحديث المشاركة بنجاح",
            data: findItem[0]
          });
        } else {
          if (isFeatured == "true") {
            req.body.isFeatured = "pending";
          }
          let updatePost = await Property.findByIdAndUpdate(id, {
            ...req.body
          });
          let findItem = await Property.find({ _id: id }).populate(
            "sellerDetails"
          );
          res.status(200).json({
            isSuccess: true,
            message:
              language == "en"
                ? "Post has been updated successfully."
                : "تم تحديث المشاركة بنجاح",
            data: findItem[0]
          });
        }
      } else {
        return res.status(401).json({
          isSuccess: false,
          message:
            language == "en"
              ? "Please login as Landlord to make changes."
              : "يرجى تسجيل الدخول باسم المالك لإجراء تغييرات"
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  makeFeaturedPost: async (req, res) => {
    try {
      let id = req.params.id;
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }

      let updatePost = await Property.findByIdAndUpdate(id, {
        $set: { isFeatured: "pending" }
      }).populate("sellerDetails");
      if (updatePost)
        return res.status(200).json({
          isSuccess: true,
          message:
            language === "en"
              ? "Featured request has been made and waiting for admin approval"
              : "تم تقديم الطلب المميز",
          data: updatePost
        });

      return res.status(200).json({
        isSuccess: true,
        message:
          language == "en"
            ? "Featured request has already been made and waiting for admin approval"
            : "تم تقديم الطلب المميز"
        // data: updatePost
      });
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  makeUnfeaturedPost: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
        language = req.query.language;
      }
      let id = req.params.id;
      let updatePost = await Property.findByIdAndUpdate(id, {
        $set: { isFeatured: false }
      }).populate("sellerDetails");
      if (updatePost) {
        return res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "Featured request has been removed"
              : "تمت إزالة الطلب المميز",
          data: updatePost
        });
      } else {
        return res.status(200).json({
          isSuccess: true,
          message:
            language == "en"
              ? "Featured request has already been removed"
              : "تمت إزالة الطلب المميز",
          data: updatePost
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  },
  changePropertyStatus: async(req, res)=>{
    try {
      let id = req.params.id;
      let updatePost = await Property.findByIdAndUpdate(id, {
        $set: { isFeatured: false }
      }).populate("sellerDetails");
      if(updatePost){
        return res.status(200).json({
          isSuccess: true,
          message: 'status for your post has been changed.'
        })
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "Something Went Wrong During the Process",
        error: error.message
      });
    }
  }
};
