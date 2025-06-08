const List = require('../models/list')
const _ = require('lodash')
module.exports = {

    createList: async (req, res) => {
        try {
            let name = req.body.name
            let findList = await List.find({ name: new RegExp('^' + name + '$', 'i') })
            if (findList.length > 0) {
                return res.status(401).json({
                    isSuccess: true,
                    message: 'List has aleready been created with this name',
                })
            } else {
                let createList = await List.create({ name: name })
                return res.status(200).json({
                    isSuccess: true,
                    message: 'List has been created Successfully',
                    list: createList
                })
            }
        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: 'something went wrong',
                error: error.message
            })
        }
    },
    addPostsToList: async (req, res) => {
        try {
            let listId = req.params.id
            let incomingPosts = req.body
            // if (typeof req.body.incomingPosts == 'string')
            //     incomingPosts = req.body.incomingPosts.split(',');
            let findList = await List.find({ '_id': listId })
            let presentArray = findList[0].assignedPosts;
            let finalArray = []
            if (presentArray.length > 0) {

                for (let i = 0; i < incomingPosts.length; i++) {
                    let result = presentArray.indexOf(incomingPosts[i])
                    console.log('result:', result)
                    if (result == -1) {
                        console.log('in the negative',incomingPosts[i])
                        finalArray.push(incomingPosts[i])
                    }
                }
            
                let afterConcatination = presentArray.concat(finalArray)
                let updateArry = await List.findOneAndUpdate({ _id: listId }, { $set: { assignedPosts: afterConcatination } })
                console.log('updated array:', updateArry)
                let findUpdatedArray = await List.find({ _id: listId })
                if (updateArry) return res.status(200).json({
                    isSuccess: true,
                    message: 'Posts have been added to the list.',
                    list: findUpdatedArray
                })
            } else {
                let presentArray = incomingPosts
                console.log('in the else section:', presentArray)
                let updateArry = await List.findOneAndUpdate({ _id: listId }, { $set: { assignedPosts: presentArray } })
                let findUpdatedArray = await List.find({ _id: listId })
                if (updateArry) return res.status(200).json({
                    isSuccess: true,
                    message: 'Posts have been added to the list.',
                    list: findUpdatedArray
                })

            }

        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: 'something went wrong',
                error: error.message
            })
        }
    },
    addPeopleToList: async (req, res) => {
        try {
            let listId = req.params.id
            let incomingPeople = req.body
         

            let findList = await List.find({ '_id': listId })
            let presentArray =  findList[0].assignedTo;
            console.log('present array:', presentArray)

            let finalArray = []

            if (presentArray.length > 0) {

                for (let i = 0; i < incomingPeople.length; i++) {
                    let result = presentArray.indexOf(incomingPeople[i])
                    console.log('result:', result)
                    if (result == -1) {
                        console.log('in the negative',incomingPeople[i])
                        finalArray.push(incomingPeople[i])
                    }
                }
                let afterConcatination = presentArray.concat(finalArray)
                let updateArry = await List.findOneAndUpdate({ _id: listId }, { $set: { assignedTo: afterConcatination } })
                console.log('updated array:', updateArry)
                let findUpdatedArray = await List.find({ _id: listId })
                if (updateArry) return res.status(200).json({
                    isSuccess: true,
                    message: 'People have been added to the list.',
                    list: findUpdatedArray
                })
            } else {
                presentArray = incomingPeople
                let updateArry = await List.findOneAndUpdate({ _id: listId }, { $set: { assignedTo: presentArray } })
                let findUpdatedArray = await List.find({ _id: listId })
                if (updateArry) return res.status(200).json({
                    isSuccess: true,
                    message: 'Posts have been added to the list.',
                    list: findUpdatedArray
                })
            }

        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: 'something went wrong',
                error: error.message
            })
        }
    },
    fetchAllLists: async (req, res) => {
        try {
            let findLists = await List.find({}).populate('assignedPosts').populate('assignedTo')
            if (findLists.length > 0) {
                return res.status(200).json({
                    isSuccess: true,
                    message: 'These are all lists.',
                    list: findLists
                })
            } else {
                return res.status(200).json({
                    isSuccess: false,
                    message: 'No List has been Found',

                })
            }
        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: 'something went wrong',
                error: error.message
            })
        }
    },
    deleteList: async (req, res) => {
        try {
            let id = req.params.id
            let deleteList = await List.deleteOne({ _id: id })
            let findLists = await List.find({})
            console.log(deleteList)
            if (deleteList.deleteCount > 0) {
                return res.status(200).json({
                    isSuccess: true,
                    message: 'List has been deleted Successfully.',
                    list: findLists
                })
            } else {
                return res.status(200).json({
                    isSuccess: false,
                    message: 'List has already been deleted',
                    list: findLists

                })
            }
        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: 'something went wrong',
                error: error.message
            })
        }
    },
    renameList: async (req, res) => {
        try {
            let name = req.body.name
            let id = req.params.id
            let updateList = await List.findOneAndUpdate({ _id: id }, { $set: { name: name } })
            let updatedList = await List.find({ _id: id })

            if (updateList) {
                return res.status(200).json({
                    isSuccess: true,
                    message: 'List is renamed successfully',
                    list: updatedList
                })
            } else {
                return res.status(200).json({
                    isSuccess: false,
                    message: `List with this name doesn't exists`,
                    list: updatedList
                })
            }

        } catch (error) {
            return res.status(401).json({
                isSuccess: false,
                message: `Document with this id doesn't exists`,
                error: error.message
            })
        }
    }
}