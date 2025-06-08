var express = require('express');
const listController = require('../controllers/listController');

var router = express.Router();

router.post('/list/createList',listController.createList)
router.post('/list/addPostsToList/:id',listController.addPostsToList)
router.post('/list/addPeopleToList/:id', listController.addPeopleToList)
router.get('/list/fetchAllLists', listController.fetchAllLists)
router.post('/list/deleteList/:id', listController.deleteList)
router.post('/list/renameList/:id', listController.renameList)

module.exports = router;
