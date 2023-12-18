const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category =  new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    color:{
        type:String,
        required:true,
        default:`#${Math.floor(Math.random()*16777215).toString(16)}`
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Category" , Category)