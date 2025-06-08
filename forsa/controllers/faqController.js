const FAQ = require("../models/faq");
module.exports = {
  addQuestion: async (req, res) => {
    try {
      let createFAQ = await FAQ.create({
        question: req.body.question,
        answer: req.body.answer
      });
      if (createFAQ) {
        return res.status(200).json({
          isSuccess: true,
          message: "Cheers! new question and answer are created.",
          data: createFAQ
        });
      }
    } catch (error) {
    
      return res.status(401).json({
        isSuccess: true,
        message: "Something went wrong during the process!",
        data: error.message
      });
    }
  },
  getFAQs: async (req, res) => {
    try {
      let language = "en";
      if (req.authData) {
        let findUser = await User.find({ _id: req.authData.id });
        language = findUser[0].language;
      } else {
      
        language  = req.query.language;
      }
      
      let findFAQs = await FAQ.find({});
      if (findFAQs.length > 0) {
        return res.status(200).json({
          isSuccess: true,
          message: language == 'en' ? "these are All FAQs" : 'هذه كلها أسئلة وأجوبة',
          data: findFAQs
        });
      } else {
        return res.status(404).json({
          isSuccess: false,
          message: language == 'en' ? "No FAQ is available.":'لا أسئلة وأجوبة متاحة',
          data: []
        });
      }
    } catch (error) {
      return res.status(401).json({
        isSuccess: false,
        message: "something went wrong during the process",
        error: error.message
      });
    }
  }
};
