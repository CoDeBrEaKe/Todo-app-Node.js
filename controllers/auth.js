const User = require('../models/user')
const Category = require('../models/category')
const bcrypt = require('bcryptjs')

const {validationResult} = require('express-validator') 

exports.getSignup = (req,res ,next)=>{

    let message = req.flash('error')

    if (message.length > 0){
        message = message[0]
    }else{
        message=null
    }

    res.render('auth/signup' , {
        errorMessage:message,
        oldInput:{
            name:"",
            email:"",
            password:""
        },
        validationErrors:[]
    })
}
exports.postSignup = (req,res ,next)=>{

    const name = req.body.name 
    const email = req.body.email 
    const password = req.body.password

    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.status(422)
        return res.render("auth/signup" , {
            errorMessage : errors.array()[0].msg,
            oldInput:{
                name:name,
                email:email,
                password:password
            },
            validationErrors:errors.array()
        })
    }

    bcrypt.hash(password , 12).then(hashedPassword =>{
        const user = new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        return user.save()
    }).then(result=>{
        return res.render("auth/login" ,  {
            message:"Account Created Successfully",
            errorMessage:"",
            oldInput:{
                email:"",
                password:""
            },
            validationErrors:[]
        })
    })
}
exports.getLogin = (req, res, next)=>{

    let message = req.flash('error')

    if (message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    res.render('auth/login' , {
        message:"",
        errorMessage:message,
        oldInput:{
            email:"",
            password:""
        },
        validationErrors:[]
    })
}

exports.postLogin = (req, res, next)=>{
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req)

    if (!errors.isEmpty()){
        res.status(422)
        return res.render('auth/login' , {
            errorMessage:errors.array()[0].msg,
            oldInput:{
                email:email,
                password:password
            },
            validationErrors:errors.array()
        })
    }

    User.findOne({email : email}).then(user=>{
        if (!user){
            res.status(422)
            return res.render('auth/login' , {
                errorMessage:errors.array()[0].msg,
                oldInput:{
                    email:email,
                    password:password
                },
                validationErrors:errors.array()
            })
        }

        return bcrypt.compare(password , user.password).then(doMatch=>{
            if(doMatch){
                req.session.isAuth = true
                req.session.user = user
                return req.session.save(err=>{
                    res.redirect('/tasks')
                })
            }
            return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "Login",
                message:"",
                errorMessage: "Invalid email or password.",
                oldInput: { email: email, password: password },
                validationErrors: errors.array(),
              });
        })
        
    })
}

exports.logout = (req,res,next)=>{
    req.session.destroy(()=>{

        res.redirect("/login");
        
    })
}