const express = require('express')

const router = express.Router()
const {check , body} = require('express-validator') 

const User = require('../models/user')
const authController = require("../controllers/auth")

router.get('/signup' , authController.getSignup)

router.post('/signup',
[
body("name")
.isAlpha()
.withMessage("Please Your Name shouldn't include numbers")
,check("email")
.isEmail()
.withMessage("Please Enter Valid Email")
.custom((value , {req})=>{
    if (value === "test@test.com"){
        throw new Error("This Email is Forbidden")
    }
    else{
        return User.findOne({email:value}).then(user=>{
            if (user){
                throw new Error("This Email is already in use")
            }
        })
    }
})
.normalizeEmail(),
body('password' , "Please put minimum 8 characters with at least 1 letter")
.isLength({min:8})
.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
.trim()
]

, authController.postSignup)

router.get('/login' , authController.getLogin)

router.post('/login' ,[
    body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail()
    ,body('password' , "Please put a min 5 characters with only numbers and text")
    .isLength({min:5})
    .isAlphanumeric()
    .trim()
] ,authController.postLogin)

router.post('/logout' , authController.logout)

module.exports = router