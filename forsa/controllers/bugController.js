const Bug = require("../models/bug");
module.exports = {
  createBug: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
         language = findUser[0].language;
      } else {
      
       language  = req.query.language;
      }
    
      let title = req.body.title;
      let description = req.body.description;
      let createBug = await Bug.create({
        title: title,
        description: description
      });
      if(createBug) return res.status(200).json({
          isSuccess: true,
          message: language == 'en'? `You bug report has been generated.`:'لقد تم إنشاء تقرير الشوائب',
          data: createBug
      })
      return res.status(401).json({
          isSuccess: false,
          message: language == 'en'? `Your Bug report has not been generated.`:'لم يتم إنشاء تقرير الأخطاء الخاص بك'
      })
    } catch (error) {
        res.status(501).json({
            isSuccess: false,
            message: 'something went wrong during the process.',
            error: error.message
        })
    }
  }
};
