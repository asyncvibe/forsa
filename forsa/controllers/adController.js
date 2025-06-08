const Ad = require("../models/ad");
module.exports = {
  createAd: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
         language = findUser[0].language;
      } else {
      
        language  = req.query.language;
      }

      let { name, imageUrl, description, link } = req.body;
      let createAd = await Ad.create({
        name: name,
        imageUrl: imageUrl,
        description: description,
        link: link
      });
      if (createAd)
        return res.status(200).json({
          isSuccess: true,
          message: language == 'en'?`You ad has been generated.`:'لقد تم إنشاء الإعلان',
          data: createAd
        });
      return res.status(401).json({
        isSuccess: false,
        message: language =='en'? `Your ad has not been generated.`:'لم يتم إنشاء إعلانك'
      });
    } catch (error) {
      res.status(501).json({
        isSuccess: false,
        message: "something went wrong during the process.",
        error: error.message
      });
    }
  },
  getAdvrtListApi: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        let language = findUser[0].language;
      } else {
      
        let language  = req.query.language;
      }

        let findAllAds = await Ad.find({})
        if(findAllAds.length > 0){
            return res.status(200).json({
                isSuccess: true,
                message: language == 'en'? 'Successfully data fetched':'تم جلب البيانات بنجاح',
                adslist: findAllAds
            })
        }else{
            return res.status(404).json({
                isSuccess: false,
                message: language == 'en'? 'No Ad Found':'لم يتم العثور على الإعلان',
                adslist: findAllAds
            })
        }
    } catch (error) {
        return res.status(200).json({
            isSuccess: false,
            message: 'Something went wrong during the process.',
            error: error.message
        })
    }
  }
};
