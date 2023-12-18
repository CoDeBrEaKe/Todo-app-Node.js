const bodyParser = require('body-parser')
const express = require('express')
require("dotenv").config();
const mongoose = require('mongoose')
// const MONGODB_URI = `mongodb://127.0.0.1:27017/${process.env.MONGO_DEFAULT_DATABASE}`;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0e8wfii.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

// Sessions packages
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const User = require("./models/user")

const app = express()
const store = new MongoDBStore({
    uri :MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf()

app.set("view engine" , "ejs")
app.set("views", "views");

const todoRoutes = require('./routes/todo')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public'))

app.use(session({secret:'mysecret' , resave : false , saveUninitialized:false , store:store}))
app.use(flash())

app.use(csrfProtection)


app.use((req, res, next)=>{
    res.locals.isAuth = req.session.isAuth
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req,res,next)=>{
    if (req.session.user){
        User.findById(req.session.user._id).then(user=>{
            if (user){
                req.user = user
                next()
            }
        })
    }else{

        next()
    }
})


app.use(todoRoutes)
app.use(authRoutes)

app.use((error,req,res,next)=>{
    res.status(500)
    res.render("500" , {
        path:"/500"
    })
})
app.use((req,res,next)=>{
    res.status(404)
    res.render("404" , {
        path:"/404"
    })
})


mongoose.connect(MONGODB_URI).then(result=>{
    console.log("Connected")
    app.listen(process.env.PORT || 3000)
}).catch(err=>{
    console.log(err)
})