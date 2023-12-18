const express = require('express')
const todoController = require('../controllers/todo')
const auth = require('../middleware/is-auth')
const {check , body} = require('express-validator')
const router = express.Router()

router.get('/' ,todoController.getHome)

router.post('/addTask', auth,body('title').trim(),todoController.createTask)

router.get('/tasks',auth ,todoController.getTasks)

router.get('/tasks/:taskId',auth , todoController.updateTask)

router.delete('/tasks/:taskId',auth ,todoController.deleteTask)


// Category routes
router.post('/addCategory',auth,body('name').isAlphanumeric().withMessage("Please Enter a Valid Category").trim(),todoController.createCategory)

router.post('/categories/:categoryId',auth ,todoController.deleteCategory)

module.exports = router