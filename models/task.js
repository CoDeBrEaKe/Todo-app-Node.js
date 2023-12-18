const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Task = new Schema({
    title:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    dateOfCreation:{
        type:Date ,
        default:Date.now()
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"Category",
    }
})
module.exports = mongoose.model("Task" , Task)
