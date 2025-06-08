const Keyword = require('../models/keyword')

module.exports = {
    createKeyword: async (req, res) => {
        try {
            let keyword = req.body.name

            let findKeyword = await Keyword.findOne({ name: keyword })

            if (findKeyword) {
                let count = (findKeyword.count) + 1
                let updateKeywordCount = await Keyword.findOneAndUpdate({ name: keyword }, { count: count })
                let updatedFindKeyword = await Keyword.findOne({ name: keyword })
                res.status(200).json({
                    isSuccess: true,
                    message: 'keyword count is increased',
                    data: updatedFindKeyword
                })
            } else {
                let createKeyword = await Keyword.create({ name: keyword })
                return res.status(401).json({
                    isSuccess: true,
                    message: 'New Keyword is Added!',
                    data: createKeyword
                })
            }

        } catch (error) {
            return res.status(401).json({
                isSuccess: true,
                message: 'Something went wrong!',
                error: error.message
            })
        }
    },

    findPopularKeywords: async (req, res) => {
        try {
            let findPopularKeywords = await Keyword.find({ count: { $gte: 10 } })
            console.log(findPopularKeywords)
            return res.status(200).json({
                isSuccess: true,
                message: 'these are popular keywords',
                data: findPopularKeywords
            })

        } catch (error) {
            return res.status(401).json({
                isSuccess: true,
                message: 'something went wrong during the process',
                error: error.message
            })
        }
    }
}