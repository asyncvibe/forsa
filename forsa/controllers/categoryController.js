
const Category = require('../models/category')



module.exports = {
    createCategory: async (req, res) =>{
        try {
            let name = req.body.name
            let image = req.image
            let findCategory = await Category.find({name: new RegExp('^' + name + '$', 'i')})
            if(findCategory.length > 0){
                return res.status(401).json({ isSuccess : false , message: 'This Category Already Exists!'})
            }else{
                let createCategory = await Category.create({
                    name: name,
                    image: image
                })
               return res.status(201).json({
                   isSuccess: true, 
                   message: 'New Category is Added',
                   category: createCategory})
            }
        } catch (error) {
            return res.status(203).json({
                isSuccess: false,
                message: 'Something went wrong during the process',
                error: error.message
            })
        }
       
    },
    fetchAllCategories: async (req, res) => {
        try {
            let allProperties = await Category.find({})
            if (allProperties.length > 0) {
                return res.status(200).json({
                    isSuccess: true,
                    message: 'It is the list of all Categories',
                    list: allProperties
                })
            } else {
                return res.status(404).json({
                    isSuccess: false,
                    message: 'No Category Found',
                    list: []
                })
            }
        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: 'Something Went Wrong During the Process',
                error: error.message
            })
        }

    }
}